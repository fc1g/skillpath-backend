import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseFactory } from '@app/common/database/database.factory';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: DatabaseFactory,
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {
	static forFeature(entities: EntityClassOrSchema[]) {
		return TypeOrmModule.forFeature(entities);
	}
}
