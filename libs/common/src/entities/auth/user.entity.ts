import {
	Column,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	OneToMany,
} from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Role } from '@app/common/entities/auth/role.entity';
import { OAuthAccount } from '@app/common/entities/auth/oauth-account.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User extends AbstractEntity<User> {
	@Column('varchar', { length: 255, nullable: false })
	email: string;

	@Column('varchar', { nullable: true })
	password: string | null;

	@Column('varchar', { length: 30, nullable: true })
	username?: string;

	@ManyToMany(() => Role, { cascade: ['insert'] })
	@JoinTable({
		name: 'user_roles',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
	})
	roles: Role[];

	@OneToMany(() => OAuthAccount, oauthAccount => oauthAccount.user, {
		cascade: true,
	})
	oauthAccounts: OAuthAccount[];
}
