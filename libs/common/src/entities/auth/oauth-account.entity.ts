import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { ProviderType } from '@app/common/enums';
import { User } from '@app/common/entities/auth/user.entity';

@Entity('oauth_accounts')
@Index(['provider', 'providerId'], { unique: true })
@Unique('uq_oauth_user_provider', ['user', 'provider'])
export class OAuthAccount extends AbstractEntity<OAuthAccount> {
	@Column({
		type: 'enum',
		enum: ProviderType,
		enumName: 'provider_type',
	})
	provider: ProviderType;

	@Column({ type: 'varchar', name: 'provider_id' })
	providerId: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	username?: string;

	@Column({ type: 'varchar', length: 255 })
	email: string;

	@ManyToOne(() => User, user => user.oauthAccounts, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	@Index()
	user: User;
}
