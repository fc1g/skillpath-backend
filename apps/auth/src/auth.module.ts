import { Module } from '@nestjs/common';
import {
	authSchema,
	baseSchema,
	ConfigModule,
	DatabaseModule,
	databaseSchema,
	HealthModule,
	LoggerModule,
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

					DATABASE_ADMIN_EMAIL: Joi.string().email().required(),
					DATABASE_ADMIN_PASSWORD: Joi.string().required(),
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
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
