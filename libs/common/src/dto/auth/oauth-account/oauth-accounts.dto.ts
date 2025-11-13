import { Expose, Type } from 'class-transformer';
import { OAuthAccountDto } from '@app/common/dto/auth/oauth-account/oauth-account.dto';

export class OAuthAccountsDto {
	@Expose()
	@Type(() => OAuthAccountDto)
	oauthAccounts: OAuthAccountDto[];
}
