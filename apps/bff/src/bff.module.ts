import { Module } from '@nestjs/common';
import {
	baseSchema,
	ConfigModule,
	HealthModule,
	LoggerModule,
} from '@app/common';
import { AuthModule } from './auth/auth.module';
import { OauthModule } from './auth/oauth/oauth.module';
import * as Joi from 'joi';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),
					HTTP_HOST: Joi.string().hostname().required(),
					HTTP_TIMEOUT: Joi.number().positive().min(1000).default(5000),

					BASE_AUTH_HTTP_URL: Joi.string().uri().required(),

					REFRESH_COOKIE_MAX_AGE: Joi.number().positive().default(604800),

					OAUTH_GITHUB_REDIRECT_URL: Joi.string().uri().required(),
					OAUTH_GOOGLE_REDIRECT_URL: Joi.string().uri().required(),

					OPENAPI_DOCUMENT_TITLE: Joi.string().required(),
					OPENAPI_DOCUMENT_DESCRIPTION: Joi.string().required(),
					OPENAPI_DOCUMENT_VERSION: Joi.string().required(),
					OPENAPI_DOCUMENT_COOKIE_NAME: Joi.string().required(),
					OPENAPI_DOCUMENT_BEARER_NAME: Joi.string().required(),

					CORS_ORIGIN: Joi.string().uri().required(),
				}),
				baseSchema,
			],
		}),
		AuthModule,
		OauthModule,
	],
})
export class BffModule {}
