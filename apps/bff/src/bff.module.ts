import { Module } from '@nestjs/common';
import { BffController } from './bff.controller';
import { BffService } from './bff.service';
import {
	baseSchema,
	ConfigModule,
	HealthModule,
	LoggerModule,
} from '@app/common';
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

					CORS_ORIGIN: Joi.string().uri().required(),
				}),
				baseSchema,
			],
		}),
	],
	controllers: [BffController],
	providers: [BffService],
})
export class BffModule {}
