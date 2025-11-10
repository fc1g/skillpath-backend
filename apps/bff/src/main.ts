import { NestFactory } from '@nestjs/core';
import { BffModule } from './bff.module';

void (async function bootstrap() {
	const app = await NestFactory.create(BffModule);
	await app.listen(process.env.port ?? 3001);
})();
