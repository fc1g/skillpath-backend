import { Expose, Type } from 'class-transformer';
import { ProviderType } from '@app/common/enums';
import { UserDto } from '@app/common/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OAuthAccountDto {
	@Expose()
	@ApiProperty({
		description: 'OAuth Account ID',
		example: 'oa_123',
		readOnly: true,
	})
	id: string;

	@Expose()
	@ApiProperty({
		description: 'Provider',
		enum: ProviderType,
		enumName: 'ProviderType',
	})
	provider: ProviderType;

	@Expose()
	@ApiProperty({
		description: 'Provider user ID (GitHub ID or Google sub)',
		example: '12345678',
	})
	providerId: string;

	@Expose()
	@ApiPropertyOptional({
		description: 'Provider username/handle',
		example: 'octocat',
	})
	username?: string;

	@Expose()
	@ApiProperty({
		description: 'Email from provider',
		example: 'dev@example.com',
		format: 'email',
	})
	email: string;

	@Expose()
	@Type(() => UserDto)
	@ApiProperty({ description: 'Linked user', type: () => UserDto })
	user: UserDto;

	@Expose()
	@ApiProperty({
		description: 'Creation timestamp',
		type: String,
		format: 'date-time',
		readOnly: true,
	})
	createdAt: Date;

	@Expose()
	@ApiProperty({
		description: 'Last update timestamp',
		type: String,
		format: 'date-time',
		readOnly: true,
	})
	updatedAt: Date;
}
