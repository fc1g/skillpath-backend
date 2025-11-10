import { NestFactory } from '@nestjs/core';
import { BffModule } from './bff.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

void (async function bootstrap() {
	const app = await NestFactory.create(BffModule);
	const configService: ConfigService = app.get(ConfigService);

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

	app.enableCors({
		origin: [configService.getOrThrow<string>('CORS_ORIGIN')],
		credentials: true,
	});

	await app.listen(
		configService.getOrThrow<number>('HTTP_PORT'),
		configService.getOrThrow<string>('HTTP_HOST'),
	);
})();
