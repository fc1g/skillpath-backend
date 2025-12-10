import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

void (async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	const configService: ConfigService = app.get(ConfigService);
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.TCP,
		options: {
			host: configService.getOrThrow<string>('TCP_HOST'),
			port: configService.getOrThrow<number>('TCP_PORT'),
		},
	});

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

	await app.startAllMicroservices();
	await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
})();
