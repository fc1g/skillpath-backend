import { Module } from '@nestjs/common';
import {
	baseSchema,
	ConfigModule,
	HealthModule,
	LoggerModule,
} from '@app/common';
import { AuthModule } from './auth/auth.module';
import { OauthModule } from './auth/oauth/oauth.module';
import { UsersModule } from './auth/users/users.module';
import { CoursesModule } from './courses/courses.module';
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

					AUTH_HOST: Joi.string().hostname().required(),
					AUTH_PORT: Joi.number().port().required(),

					BASE_AUTH_HTTP_URL: Joi.string().uri().required(),

					REFRESH_EXPIRES: Joi.number().positive().default(604800),
					ACCESS_EXPIRES: Joi.number().positive().default(900),

					OAUTH_GITHUB_REDIRECT_URL: Joi.string().uri().required(),
					OAUTH_GOOGLE_REDIRECT_URL: Joi.string().uri().required(),

					OPENAPI_DOCUMENT_TITLE: Joi.string().required(),
					OPENAPI_DOCUMENT_DESCRIPTION: Joi.string().required(),
					OPENAPI_DOCUMENT_VERSION: Joi.string().required(),
					OPENAPI_DOCUMENT_COOKIE_NAME: Joi.string().required(),
					OPENAPI_DOCUMENT_BEARER_NAME: Joi.string().required(),

					CORS_ORIGINS: Joi.string().uri().required(),
				}),
				baseSchema,
			],
		}),
		AuthModule,
		OauthModule,
		UsersModule,
		CoursesModule,
	],
})
export class BffModule {}
