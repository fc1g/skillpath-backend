import { Module } from '@nestjs/common';
import {
	authSchema,
	baseSchema,
	ConfigModule,
	DatabaseModule,
	databaseSchema,
	HealthModule,
	LoggerModule,
	RedisModule,
	redisSchema,
} from '@app/common';
import * as Joi from 'joi';
import accessJwtConfig, { ACCESS_JWT } from './config/access-jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig, { REFRESH_JWT } from './config/refresh-jwt.config';
import { RefreshTokenIdsStorage } from './storages/refresh-token-ids.storage';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),

					DATABASE_ADMIN_EMAIL: Joi.string().email().required(),
					DATABASE_ADMIN_PASSWORD: Joi.string().required(),
				}),
				baseSchema,
				databaseSchema,
				redisSchema,
				authSchema,
			],
		}),
		ConfigModule.forFeature([accessJwtConfig, refreshJwtConfig]),
		DatabaseModule,
		RedisModule,
		UsersModule,
	],
	controllers: [AuthController],
	providers: [
		{
			provide: ACCESS_JWT,
			inject: [accessJwtConfig.KEY],
			useFactory: (config: ConfigType<typeof accessJwtConfig>) =>
				new JwtService(config),
		},
		{
			provide: REFRESH_JWT,
			inject: [refreshJwtConfig.KEY],
			useFactory: (config: ConfigType<typeof refreshJwtConfig>) =>
				new JwtService(config),
		},
		LocalStrategy,
		AccessJwtStrategy,
		RefreshJwtStrategy,
		AuthService,
		RefreshTokenIdsStorage,
	],
})
export class AuthModule {}
