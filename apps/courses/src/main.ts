import { NestFactory } from '@nestjs/core';
import { CoursesModule } from './courses.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

void (async function bootstrap() {
	const app = await NestFactory.create(CoursesModule);
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

	await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
})();
