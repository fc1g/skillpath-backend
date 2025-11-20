import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class AbstractEntity<T> {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string;

	@Field(() => Date, { description: 'Creation timestamp' })
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@Field(() => Date, {
		description: 'Last update timestamp',
	})
	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	constructor(entity: Partial<T>) {
		Object.assign(this, entity);
	}
}
