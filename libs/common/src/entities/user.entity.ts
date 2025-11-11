import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '@app/common/database';

@Entity('users')
@Index(['email'], { unique: true })
export class User extends AbstractEntity<User> {
	@Column('varchar', { length: 256, nullable: false })
	email: string;

	@Column('varchar', { nullable: false })
	password: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
