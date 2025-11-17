import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsUUID,
} from 'class-validator';
import { ProviderType } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOAuthAccountDto {
	@IsEnum(ProviderType)
	@IsNotEmpty()
	@ApiProperty({
		description: 'OAuth provider',
		enum: ProviderType,
		enumName: 'ProviderType',
		example: ProviderType.GITHUB,
	})
	provider: ProviderType;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({
		description: 'Provider usr ID',
		example: '12345678',
	})
	providerId: string;

	@IsOptional()
	@ApiProperty({
		description: 'Provider username/handle',
		example: 'octocat',
	})
	username?: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({
		description: 'Email from provider (used to link accounts)',
		example: 'dev@example.com',
		format: 'email',
	})
	email: string;

	@IsUUID()
	@ApiProperty({
		description: 'Existing User ID to link this OAuth account to',
		example: '0b5c0d2a-1f3a-4d21-9a9b-2c5c3f3d3b1f',
		required: true,
	})
	userId?: string;
}
