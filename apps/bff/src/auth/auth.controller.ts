import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCookieAuth,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	ChangePasswordDto,
	CreateUserDto,
	ForgotPasswordDto,
	ResetPasswordDto,
	SetPasswordDto,
} from '@app/common';
import type { Request, Response } from 'express';
import { AuthAwareHttpClientService } from './auth-aware.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly authAwareHttpClientService: AuthAwareHttpClientService,
	) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Email/password signup' })
	@ApiBody({ type: CreateUserDto, description: 'User credentials' })
	@ApiCreatedResponse({
		description: 'Returns access/refresh token pair',
		schema: {
			type: 'object',
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiConflictResponse({ description: 'User with this email already exists' })
	@ApiBadRequestResponse({ description: 'Validation error' })
	async signup(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.signup(createUserDto, res);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Email/password login' })
	@ApiBody({ type: CreateUserDto, description: 'User credentials' })
	@ApiOkResponse({
		description: 'Returns access/refresh token pair',
		schema: {
			type: 'object',
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBadRequestResponse({ description: 'Provider-only account' })
	async login(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(createUserDto, res);
	}

	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Invalidate current refresh session' })
	@ApiCookieAuth('refreshToken')
	@ApiNoContentResponse({ description: 'Logged out' })
	@ApiUnauthorizedResponse({ description: 'Refresh token invalid/expired' })
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res);
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Rotate refresh token and issue new pair' })
	@ApiCookieAuth('refreshToken')
	@ApiOkResponse({
		description: 'Returns new access/refresh token pair',
		schema: {
			type: 'object',
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'Refresh token invalidated/expired' })
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.rotateTokens(req, res);
	}

	@Patch('set-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Set user password after registration' })
	@ApiBody({ type: SetPasswordDto, description: 'User credentials' })
	@ApiNoContentResponse({ description: 'Password set successful' })
	@ApiBadRequestResponse({ description: 'Invalid password' })
	async setPassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() setPasswordDto: SetPasswordDto,
	) {
		return this.authAwareHttpClientService.execute(req, res, () =>
			this.authService.setPassword(req, setPasswordDto),
		);
	}

	@Patch('change-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Change user password' })
	@ApiBody({ type: ChangePasswordDto, description: 'User credentials' })
	@ApiNoContentResponse({ description: 'Password changed successful' })
	@ApiBadRequestResponse({ description: 'Invalid password' })
	async changePassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() changePasswordDto: ChangePasswordDto,
	) {
		return this.authAwareHttpClientService.execute(req, res, () =>
			this.authService.changePassword(req, changePasswordDto),
		);
	}

	@Post('forgot-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Send password reset link to user email' })
	@ApiBody({ type: ForgotPasswordDto, description: 'User credentials' })
	@ApiNoContentResponse({ description: 'Password reset link sent' })
	@ApiBadRequestResponse({ description: 'Invalid email' })
	async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPasswordDto);
	}

	@Post('reset-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Reset user password using reset link' })
	@ApiBody({ type: ResetPasswordDto, description: 'User credentials' })
	@ApiNoContentResponse({ description: 'Password reset successful' })
	@ApiBadRequestResponse({ description: 'Invalid reset link' })
	async resetPassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() resetPasswordDto: ResetPasswordDto,
	) {
		return this.authService.resetPassword(req, res, resetPasswordDto);
	}
}
