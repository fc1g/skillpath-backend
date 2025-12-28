import { Module } from '@nestjs/common';
import {
	authSchema,
	baseSchema,
	ConfigModule,
	DatabaseModule,
	databaseSchema,
	HealthModule,
	LoggerModule,
	NOTIFICATIONS_SERVICE,
	oauthSchema,
	redisSchema,
} from '@app/common';
import * as Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokensModule } from './jwt-tokens/jwt-tokens.module';
import { UsersModule } from './users/users.module';
import { StrategiesModule } from './strategies/strategies.module';
import { OAuthModule } from './oauth/oauth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { OneTimeTokenModule } from './one-time-token/one-time-token.module';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),

					TCP_HOST: Joi.string().hostname().required(),
					TCP_PORT: Joi.number().port().required(),

					RABBITMQ_URI: Joi.string().uri().required(),

					DATABASE_ADMIN_EMAIL: Joi.string().email().required(),
					DATABASE_ADMIN_PASSWORD: Joi.string().required(),

					ONE_TIME_TOKEN_SECRET: Joi.string().required(),
					ONE_TIME_TOKEN_EXPIRATION_TIME: Joi.number().positive().default(900),
				}),
				baseSchema,
				databaseSchema,
				redisSchema,
				authSchema,
				oauthSchema,
			],
		}),
		DatabaseModule,
		UsersModule,
		JwtTokensModule,
		StrategiesModule,
		OAuthModule,
		ClientsModule.registerAsync([
			{
				name: NOTIFICATIONS_SERVICE,
				useFactory: (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [config.getOrThrow<string>('RABBITMQ_URI')],
						queue: 'notifications',
						queueOptions: {
							durable: true,
						},
					},
				}),
				inject: [ConfigService],
			},
		]),
		OneTimeTokenModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
