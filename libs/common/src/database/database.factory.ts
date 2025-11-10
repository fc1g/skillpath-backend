import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseFactory implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const type = this.configService.getOrThrow<string>('DATABASE_TYPE');

		switch (type) {
			case 'postgres':
				return {
					type,
					host: this.configService.getOrThrow<string>('DATABASE_HOST'),
					port: this.configService.getOrThrow<number>('DATABASE_PORT'),
					username: this.configService.getOrThrow<string>('DATABASE_USERNAME'),
					password: this.configService.getOrThrow<string>('DATABASE_PASSWORD'),
					database: this.configService.getOrThrow<string>('DATABASE_NAME'),
					synchronize: this.configService.getOrThrow<boolean>(
						'DATABASE_SYNCHRONIZE',
					),
					autoLoadEntities: true,
				};

			case 'mongodb':
				return {
					type,
					url: this.configService.getOrThrow<string>('DATABASE_URI'),
				};

			default:
				return {};
		}
	}
}
