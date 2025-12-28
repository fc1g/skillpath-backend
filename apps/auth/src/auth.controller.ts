import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	ChangePasswordDto,
	CreateUserDto,
	CurrentUser,
	ForgotPasswordDto,
	MeDto,
	RefreshTokenPayloadInterface,
	ResetPasswordDto,
	Serialize,
	SetPasswordDto,
	User,
} from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { AccessJwtGuard } from './guards/access-jwt.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMapper } from './users/mappers/user.mapper';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.signup(createUserDto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@CurrentUser() user: User) {
		return await this.authService.login(user);
	}

	@UseGuards(RefreshJwtGuard)
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(
		@CurrentUser() refreshTokenPayload: RefreshTokenPayloadInterface,
	) {
		return this.authService.logout(refreshTokenPayload);
	}

	@UseGuards(RefreshJwtGuard)
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(
		@CurrentUser() refreshTokenPayload: RefreshTokenPayloadInterface,
	) {
		return this.authService.rotateTokens(refreshTokenPayload);
	}

	@UseGuards(AccessJwtGuard)
	@Patch('set-password')
	async setPassword(
		@CurrentUser() user: User,
		@Body() setPasswordDto: SetPasswordDto,
	) {
		return this.authService.setPassword(user, setPasswordDto);
	}

	@UseGuards(AccessJwtGuard)
	@Patch('change-password')
	async changePassword(
		@CurrentUser() user: User,
		@Body() changePasswordDto: ChangePasswordDto,
	) {
		return this.authService.changePassword(user, changePasswordDto);
	}

	@Post('forgot-password')
	async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPasswordDto);
	}

	@Post('reset-password')
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.authService.resetPassword(resetPasswordDto);
	}

	@UseGuards(AccessJwtGuard)
	@Serialize(MeDto)
	@MessagePattern('authenticate')
	authenticate(@Payload() data: { user: User }) {
		return UserMapper.toMeDto(data.user);
	}
}
