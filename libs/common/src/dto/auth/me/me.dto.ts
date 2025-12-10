import { Expose } from 'class-transformer';
import { ProviderType, RoleType } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeDto {
	@Field(() => ID)
	@ApiProperty({
		description: 'OAuth Account ID',
		example: 'oa_123',
		readOnly: true,
	})
	@Expose()
	id: string;

	@Field()
	@ApiProperty({
		description: 'User email address',
		example: 'dev@example.com',
		format: 'email',
	})
	@Expose()
	email: string;

	@Field(() => String, { nullable: true })
	@ApiProperty({
		description: 'Provider username/handle',
		nullable: true,
		example: 'octocat',
	})
	@Expose()
	name: string | null;

	@Field(() => [RoleType])
	@ApiProperty({
		description: 'Assigned roles',
		enum: RoleType,
		enumName: 'RoleType',
		isArray: true,
		example: [RoleType.USER],
	})
	@Expose()
	roles: RoleType[];

	@Field(() => [ProviderType])
	@ApiProperty({
		description: 'Connected OAuth providers',
		enum: ProviderType,
		enumName: 'ProviderType',
		isArray: true,
		example: [ProviderType.GITHUB, ProviderType.GOOGLE],
	})
	@Expose()
	providers: ProviderType[];

	@Field(() => Boolean)
	@ApiProperty({
		description: 'Has local password (email + password auth)',
		example: true,
	})
	@Expose()
	hasPassword: boolean;
}
