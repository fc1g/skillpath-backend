import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '@app/common/redis/redis-client.token';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
	constructor(
		@Inject(REDIS_CLIENT) private readonly client: Redis,
		private readonly configService: ConfigService,
	) {}

	async get<T = string>(key: string): Promise<T | null> {
		const value = await this.client.get(this.k(key));
		if (value === null) return null;

		try {
			return JSON.parse(value) as T;
		} catch {
			return value as T;
		}
	}

	async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const payload = typeof value === 'string' ? value : JSON.stringify(value);
		if (ttlSeconds && ttlSeconds > 0) {
			await this.client.set(this.k(key), payload, 'EX', ttlSeconds);
		} else {
			await this.client.set(this.k(key), payload);
		}
	}

	async del(key: string): Promise<void> {
		await this.client.del(this.k(key));
	}

	async expire(key: string, ttlSeconds: number): Promise<void> {
		await this.client.expire(this.k(key), ttlSeconds);
	}

	async exists(key: string) {
		return (await this.client.exists(this.k(key))) === 1;
	}

	private k(key: string) {
		const prefix = this.configService.getOrThrow<string>('REDIS_KEY_PREFIX');
		return prefix ? `${prefix}:${key}` : key;
	}
}
