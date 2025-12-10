import { NestFactory } from '@nestjs/core';
import { BffModule } from './bff.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

void (async function bootstrap() {
	const app = await NestFactory.create(BffModule);
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

	app.enableCors({
		origin: [configService.getOrThrow<string>('CORS_ORIGINS')],
		credentials: true,
	});

	const options = new DocumentBuilder()
		.setTitle(configService.getOrThrow<string>('OPENAPI_DOCUMENT_TITLE'))
		.setDescription(
			configService.getOrThrow<string>('OPENAPI_DOCUMENT_DESCRIPTION'),
		)
		.setVersion(configService.getOrThrow<string>('OPENAPI_DOCUMENT_VERSION'))
		.addCookieAuth(
			configService.getOrThrow<string>('OPENAPI_DOCUMENT_COOKIE_NAME'),
		)
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Use Authorization: Bearer <accessToken>',
			},
			configService.getOrThrow<string>('OPENAPI_DOCUMENT_BEARER_NAME'),
		)
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('/', app, document);

	await app.listen(
		configService.getOrThrow<number>('HTTP_PORT'),
		configService.getOrThrow<string>('HTTP_HOST'),
	);
})();
