import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

export class InvalidatedOneTimeTokenError extends BadRequestException {
	constructor(public readonly reason: 'EXPIRED' | 'MISMATCH') {
		super(`One-time token invalid: ${reason}`);
	}
}

@Injectable()
export class OneTimeTokenService {
	constructor(
		private readonly redis: RedisService,
		private readonly configService: ConfigService,
	) {}

	async insert(userId: string): Promise<string> {
		const rawToken = crypto.randomBytes(32).toString('base64url');
		const hashedToken = this.hmacSha256(
			rawToken,
			this.configService.getOrThrow('ONE_TIME_TOKEN_SECRET'),
		);
		await this.redis.set(
			this.k(hashedToken),
			userId,
			this.configService.getOrThrow<number>('ONE_TIME_TOKEN_EXPIRATION_TIME'),
		);

		return rawToken;
	}

	async validate(userId: string, rawToken: string): Promise<void> {
		const hashedToken = this.hmacSha256(
			rawToken,
			this.configService.getOrThrow('ONE_TIME_TOKEN_SECRET'),
		);
		const stored = await this.redis.get<string>(this.k(hashedToken));

		if (!stored) {
			throw new InvalidatedOneTimeTokenError('EXPIRED');
		}

		if (stored !== userId) {
			throw new InvalidatedOneTimeTokenError('MISMATCH');
		}

		await this.invalidate(rawToken);
	}

	async validateAndGetUserId(rawToken: string): Promise<string> {
		const hashedToken = this.hmacSha256(
			rawToken,
			this.configService.getOrThrow<string>('ONE_TIME_TOKEN_SECRET'),
		);
		const userId = await this.redis.get<string>(this.k(hashedToken));

		if (!userId) {
			throw new InvalidatedOneTimeTokenError('EXPIRED');
		}

		await this.invalidate(rawToken);

		return userId;
	}

	async invalidate(rawToken: string): Promise<void> {
		const hashedToken = this.hmacSha256(
			rawToken,
			this.configService.getOrThrow('ONE_TIME_TOKEN_SECRET'),
		);
		await this.redis.del(this.k(hashedToken));
	}

	private k(hashedToken: string) {
		return `auth:pwdreset:token:${hashedToken}`;
	}

	private hmacSha256(data: string, secret: string) {
		return crypto.createHmac('sha256', secret).update(data).digest('hex');
	}
}
