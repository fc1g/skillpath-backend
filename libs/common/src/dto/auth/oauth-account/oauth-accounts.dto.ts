import { Expose, Type } from 'class-transformer';
import { OAuthAccountDto } from '@app/common/dto/auth/oauth-account/oauth-account.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OAuthAccountsDto {
	@Expose()
	@Type(() => OAuthAccountDto)
	@ApiProperty({
		description: 'List of OAuth accounts',
		type: () => OAuthAccountDto,
		isArray: true,
	})
	oauthAccounts: OAuthAccountDto[];
}
