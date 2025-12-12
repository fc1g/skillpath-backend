import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	InvalidatedRefreshTokenError,
	RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { ACCESS_JWT } from './config/access-jwt.config';
import { REFRESH_JWT } from './config/refresh-jwt.config';
import { MeDto } from '@app/common';
import { randomUUID } from 'crypto';

type TokenPair = {
	accessToken: string;
	refreshToken: string;
};

@Injectable()
export class JwtTokensService {
	constructor(
		private readonly storage: RefreshTokenIdsStorage,
		@Inject(ACCESS_JWT) private readonly accessJwt: JwtService,
		@Inject(REFRESH_JWT) private readonly refreshJwt: JwtService,
	) {}

	async issuePairForUser(user: MeDto): Promise<TokenPair> {
		const jti = randomUUID();
		const [accessToken, refreshToken] = await Promise.all([
			this.signAccess(user.id, { roles: user.roles }),
			this.signRefresh(user.id, { jti }),
		]);
		await this.storage.insert(user.id, jti);
		return {
			accessToken,
			refreshToken,
		};
	}

	async verifyAndInvalidateRefresh(userId: string, jti: string): Promise<void> {
		try {
			const isValid = await this.storage.validate(userId, jti);
			if (isValid) await this.storage.invalidate(userId);
		} catch (err) {
			if (err instanceof InvalidatedRefreshTokenError) {
				throw new UnauthorizedException(err.message);
			}
			throw err;
		}
	}

	async rotate(user: MeDto, jti: string): Promise<TokenPair> {
		await this.verifyAndInvalidateRefresh(user.id, jti);

		return this.issuePairForUser(user);
	}

	private async signAccess<T>(userId: string, payload: T): Promise<string> {
		return this.accessJwt.signAsync({ userId, type: 'access', ...payload });
	}

	private async signRefresh<T extends object>(
		userId: string,
		payload: T,
	): Promise<string> {
		return this.refreshJwt.signAsync({ userId, type: 'refresh', ...payload });
	}
}
