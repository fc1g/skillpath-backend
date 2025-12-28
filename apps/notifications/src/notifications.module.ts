import {
	baseSchema,
	ConfigModule,
	HealthModule,
	LoggerModule,
	RmqModule,
} from '@app/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { NotificationsController } from './notifications.controller';
import { NotificationsFactory } from './notifications.factory';
import { NotificationsService } from './notifications.service';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),

					RABBITMQ_URI: Joi.string().uri().required(),

					SMTP_USER: Joi.string().email().required(),
					GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
					GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
					GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),

					FRONTEND_URL: Joi.string().uri().required(),
				}),
				baseSchema,
			],
		}),
		MailerModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				transport: {
					service: 'gmail',
					auth: {
						type: 'OAuth2',
						user: config.getOrThrow<string>('SMTP_USER'),
						clientId: config.getOrThrow<string>('GOOGLE_OAUTH_CLIENT_ID'),
						clientSecret: config.getOrThrow<string>(
							'GOOGLE_OAUTH_CLIENT_SECRET',
						),
						refreshToken: config.getOrThrow<string>(
							'GOOGLE_OAUTH_REFRESH_TOKEN',
						),
					},
				},
				defaults: {
					from: `"SkillPath" <${config.getOrThrow<string>('SMTP_USER')}>`,
				},
				template: {
					dir: join(__dirname, 'templates'),
					adapter: new HandlebarsAdapter(),
					options: { strict: true },
				},
			}),
			inject: [ConfigService],
		}),
		RmqModule,
	],
	controllers: [NotificationsController],
	providers: [NotificationsService, NotificationsFactory],
})
export class NotificationsModule {}
