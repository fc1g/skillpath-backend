import { Expose, Type } from 'class-transformer';
import { ProviderType } from '@app/common/enums';
import { UserDto } from '@app/common/dto';

export class OAuthAccountDto {
	@Expose()
	id: string;

	@Expose()
	provider: ProviderType;

	@Expose()
	providerId: string;

	@Expose()
	username?: string;

	@Expose()
	email: string;

	@Expose()
	@Type(() => UserDto)
	user: UserDto;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
