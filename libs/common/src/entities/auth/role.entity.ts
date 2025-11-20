import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { RoleType } from '@app/common/enums';
import { User } from '@app/common/entities/auth/user.entity';

@Entity('roles')
@Index(['name'], { unique: true })
export class Role extends AbstractEntity<Role> {
	@Column('enum', { enum: RoleType })
	name: RoleType;

	@ManyToMany(() => User, user => user.roles)
	users: User[];
}
