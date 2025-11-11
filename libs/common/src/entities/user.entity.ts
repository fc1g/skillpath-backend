import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Role } from '@app/common/entities/role.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User extends AbstractEntity<User> {
	@Column('varchar', { length: 256, nullable: false })
	email: string;

	@Column('varchar', { nullable: false })
	password: string;

	@ManyToMany(() => Role, { cascade: true })
	@JoinTable({
		name: 'user_roles',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
	})
	roles: Role[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
