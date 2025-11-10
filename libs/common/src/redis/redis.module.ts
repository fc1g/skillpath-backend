import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { RedisService } from '@app/common/redis/redis.service';
import { REDIS_CLIENT } from '@app/common/redis/redis-client.token';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
	providers: [
		{
			provide: REDIS_CLIENT,
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const host = config.getOrThrow<string>('REDIS_HOST');
				const port = config.getOrThrow<number>('REDIS_PORT');
				const db = config.getOrThrow<number>('REDIS_DB');

				const client = new Redis({
					host,
					port,
					db,
					password: config.getOrThrow<string>('REDIS_PASSWORD'),
					keyPrefix: config.getOrThrow<string>('REDIS_KEY_PREFIX'),
					connectTimeout: Number(config.getOrThrow('REDIS_CONNECT_TIMEOUT_MS')),
				});

				const redisLogger = new Logger('Redis');
				client.on('connect', () =>
					redisLogger.log(`connect ${host}:${port}/${db}`),
				);
				client.on('ready', () => redisLogger.log(`ready`));
				client.on('reconnecting', () => redisLogger.warn('reconnecting...'));
				client.on('end', () => redisLogger.warn('end'));
				client.on('error', err => redisLogger.error(err));

				return client;
			},
		},
		RedisService,
	],
	exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule implements OnApplicationShutdown {
	constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

	async onApplicationShutdown(): Promise<void> {
		await this.client.quit();
	}
}
