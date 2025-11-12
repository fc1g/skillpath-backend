import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto, RefreshTokenPayloadInterface, User } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import {
	InvalidatedRefreshTokenError,
	RefreshTokenIdsStorage,
} from './storages/refresh-token-ids.storage';
import { ACCESS_JWT } from './config/access-jwt.config';
import { REFRESH_JWT } from './config/refresh-jwt.config';
import { randomUUID } from 'crypto';

type TokenType = 'access' | 'refresh';

@Injectable()
export class AuthService {
	private readonly jwt: Record<TokenType, JwtService>;

	constructor(
		private readonly usersService: UsersService,
		private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
		@Inject(ACCESS_JWT) private readonly accessJwt: JwtService,
		@Inject(REFRESH_JWT) private readonly refreshJwt: JwtService,
	) {
		this.jwt = {
			access: accessJwt,
			refresh: refreshJwt,
		};
	}

	async signup(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);
		return this.buildTokenResponse(user);
	}

	async login(user: User) {
		return this.buildTokenResponse(user);
	}

	async logout(refreshTokenPayload: RefreshTokenPayloadInterface) {
		return this.verifyRefreshToken(
			refreshTokenPayload.userId,
			refreshTokenPayload.jti,
		);
	}

	async rotateTokens(refreshTokenPayload: RefreshTokenPayloadInterface) {
		const user = await this.usersService.findOne(refreshTokenPayload.userId);

		await this.verifyRefreshToken(
			refreshTokenPayload.userId,
			refreshTokenPayload.jti,
		);

		return this.buildTokenResponse(user);
	}

	private async verifyRefreshToken(userId: string, jti: string) {
		let isValid: boolean = false;

		try {
			isValid = await this.refreshTokenIdsStorage.validate(userId, jti);
		} catch (err) {
			if (err instanceof InvalidatedRefreshTokenError) {
				throw new UnauthorizedException(err.message);
			}
		}

		if (isValid) {
			await this.refreshTokenIdsStorage.invalidate(userId);
		}
	}

	private async buildTokenResponse(user: User) {
		const tokens = await this.generateTokens(user);
		return {
			...tokens,
		};
	}

	private async generateTokens(
		user: User,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const jti = randomUUID();
		const [accessToken, refreshToken] = await Promise.all([
			this.signToken(user.id, 'access', { roles: user.roles }),
			this.signToken(user.id, 'refresh', { jti }),
		]);

		await this.refreshTokenIdsStorage.insert(user.id, jti);

		return { accessToken, refreshToken };
	}

	private async signToken<T extends object>(
		userId: string,
		type: TokenType,
		payload: T,
	): Promise<string> {
		const jwtService = this.jwt[type];
		if (!jwtService) {
			throw new Error(`Unknown token type: ${type}`);
		}

		return await jwtService.signAsync({ userId, type, ...payload });
	}
}
