import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from './users/users.service';
import {
	ChangePasswordDto,
	CreateUserDto,
	ForgotPasswordDto,
	NOTIFICATIONS_SERVICE,
	RefreshTokenPayloadInterface,
	ResetPasswordDto,
	SetPasswordDto,
	User,
} from '@app/common';
import { JwtTokensService } from './jwt-tokens/jwt-tokens.service';
import { UserMapper } from './users/mappers/user.mapper';
import { ClientProxy } from '@nestjs/microservices';
import { OneTimeTokenService } from './one-time-token/one-time-token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly tokensService: JwtTokensService,
		@Inject(NOTIFICATIONS_SERVICE)
		private readonly notificationsService: ClientProxy,
		private readonly oneTimeTokenService: OneTimeTokenService,
		private readonly configService: ConfigService,
	) {}

	async signup(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);

		const me = UserMapper.toMeDto(user);
		const tokens = await this.tokensService.issuePairForUser(me);

		return {
			user: me,
			...tokens,
		};
	}

	async login(user: User) {
		const me = UserMapper.toMeDto(user);

		const tokens = await this.tokensService.issuePairForUser(me);
		return {
			user: me,
			...tokens,
		};
	}

	async logout({ userId, jti }: RefreshTokenPayloadInterface) {
		return this.tokensService.verifyAndInvalidateRefresh(userId, jti);
	}

	async rotateTokens({ userId, jti }: RefreshTokenPayloadInterface) {
		const user = await this.usersService.findOne(userId);

		const me = UserMapper.toMeDto(user);
		const tokens = await this.tokensService.rotate(me, jti);

		return {
			user: me,
			...tokens,
		};
	}

	async setPassword(user: User, { newPassword }: SetPasswordDto) {
		return this.usersService.setPassword(user, newPassword);
	}

	async changePassword(
		user: User,
		{ currentPassword, newPassword }: ChangePasswordDto,
	) {
		return this.usersService.changePassword(user, currentPassword, newPassword);
	}

	async forgotPassword({ email }: ForgotPasswordDto) {
		const user = await this.usersService.findOneByEmail(email);

		const token = await this.oneTimeTokenService.insert(user.id);

		this.notificationsService.emit('auth.password_reset.requested', {
			email,
			token,
			ttlLabel:
				this.configService.getOrThrow<number>(
					'ONE_TIME_TOKEN_EXPIRATION_TIME',
				) / 60,
			username: user?.username,
		});
	}

	async resetPassword({ token, newPassword }: ResetPasswordDto) {
		const userId = await this.oneTimeTokenService.validateAndGetUserId(token);

		const user = await this.usersService.findOne(userId);

		await this.usersService.resetPassword(userId, newPassword);

		this.notificationsService.emit('auth.password_reset.completed', {
			email: user.email,
			username: user?.username,
		});
	}
}
