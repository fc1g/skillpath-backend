import { Expose } from 'class-transformer';
import { ProviderType, RoleType } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class MeDto {
	@Expose()
	@ApiProperty({
		description: 'OAuth Account ID',
		example: 'oa_123',
		readOnly: true,
	})
	id: string;

	@Expose()
	@ApiProperty({
		description: 'User email address',
		example: 'dev@example.com',
		format: 'email',
	})
	email: string;

	@Expose()
	@ApiProperty({
		description: 'Provider username/handle',
		nullable: true,
		example: 'octocat',
	})
	name: string | null;

	@Expose()
	@ApiProperty({
		description: 'Assigned roles',
		enum: RoleType,
		enumName: 'RoleType',
		isArray: true,
		example: [RoleType.USER],
	})
	roles: RoleType[];

	@Expose()
	@ApiProperty({
		description: 'Connected OAuth providers',
		enum: ProviderType,
		enumName: 'ProviderType',
		isArray: true,
		example: [ProviderType.GITHUB, ProviderType.GOOGLE],
	})
	providers: ProviderType[];

	@Expose()
	@ApiProperty({
		description: 'Has local password (email + password auth)',
		example: true,
	})
	hasPassword: boolean;
}
