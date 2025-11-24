import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({
	path: join(process.cwd(), 'apps/auth/.env.production.local'),
});

export default new DataSource({
	type: 'postgres',
	host:
		process.env.MIGRATION_TYPE === 'run'
			? process.env.DATABASE_HOST
			: 'localhost',
	port: parseInt(process.env.DATABASE_PORT ?? '5432'),
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: false,
	migrationsRun: false,
	entities: [__dirname + '/../**/*.entity.{ts,js}'],
	migrations: [__dirname + '/migrations/*.{ts,js}'],
});
