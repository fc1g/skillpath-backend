import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';

void (async function bootstrap() {
	const app = await NestFactory.create(NotificationsModule);
	const configService = app.get(ConfigService);

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
			noAck: false,
			queue: configService.getOrThrow<string>('NOTIFICATIONS_QUEUE'),
			queueOptions: {
				durable: true,
			},
		},
	});

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
