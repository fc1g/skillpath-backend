import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

void (async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	const configService: ConfigService = app.get(ConfigService);

	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);
	app.useLogger(app.get(Logger));
	app.enableShutdownHooks();

	await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
})();
