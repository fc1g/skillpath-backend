import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
	baseSchema,
	ConfigModule,
	DatabaseModule,
	databaseSchema,
	HealthModule,
	LoggerModule,
} from '@app/common';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		HealthModule,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchemas: [
				Joi.object({
					HTTP_PORT: Joi.number().port().required(),
				}),
				baseSchema,
				databaseSchema,
			],
		}),
		DatabaseModule,
		UsersModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
