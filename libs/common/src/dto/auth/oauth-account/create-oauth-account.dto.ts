import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsUUID,
} from 'class-validator';
import { ProviderType } from '@app/common/enums';
import { Type } from 'class-transformer';
import { User } from '@app/common/entities';

export class CreateOAuthAccountDto {
	@IsEnum(ProviderType)
	@IsNotEmpty()
	provider: ProviderType;

	@IsUUID()
	@IsNotEmpty()
	providerId: string;

	@IsOptional()
	username?: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Type(() => User)
	@IsNotEmpty()
	user: User;
}
