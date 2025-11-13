import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@app/common';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

export class InvalidatedRefreshTokenError extends Error {
	constructor(public readonly reason: 'MISSING' | 'MISMATCH') {
		super(`Refresh token invalid: ${reason}`);
	}
}

@Injectable()
export class RefreshTokenIdsStorage {
	constructor(
		private readonly redis: RedisService,
		@Inject(refreshJwtConfig.KEY)
		private readonly refreshJwtConfigurable: ConfigType<
			typeof refreshJwtConfig
		>,
	) {}

	async insert(userId: string, tokenId: string): Promise<void> {
		await this.redis.set(
			this.k(userId),
			tokenId,
			this.refreshJwtConfigurable.signOptions.expiresIn,
		);
	}

	async validate(userId: string, tokenId: string): Promise<boolean> {
		const stored = await this.redis.get<string>(this.k(userId));

		if (!stored) {
			throw new InvalidatedRefreshTokenError('MISSING');
		}

		if (stored !== tokenId) {
			throw new InvalidatedRefreshTokenError('MISMATCH');
		}

		return true;
	}

	async invalidate(userId: string): Promise<void> {
		await this.redis.del(this.k(userId));
	}

	private k(userId: string) {
		return `refresh:jti#${userId}`;
	}
}
