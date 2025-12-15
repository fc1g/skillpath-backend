import { Injectable } from '@nestjs/common';
import { OAuthUser } from '@app/common';
import { UsersService } from '../users/users.service';
import { JwtTokensService } from '../jwt-tokens/jwt-tokens.service';
import { OAuthAccountsService } from './oauth-accounts/oauth-accounts.service';
import { UserMapper } from '../users/mappers/user.mapper';

@Injectable()
export class OAuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly oauthAccountsService: OAuthAccountsService,
		private readonly tokensService: JwtTokensService,
	) {}

	async handleCallback(oauthUser: OAuthUser) {
		const user = await this.usersService.preloadUserByEmail({
			email: oauthUser.email,
			password: null,
		});

		const oauthAccount =
			await this.oauthAccountsService.preloadOAuthAccountByProvider(
				user.id,
				oauthUser,
			);

		if (
			Array.isArray(user.oauthAccounts) &&
			!user.oauthAccounts.includes(oauthAccount)
		) {
			user.oauthAccounts.push(oauthAccount);
		} else {
			user.oauthAccounts = [oauthAccount];
		}

		if (!user.username && oauthAccount.username) {
			user.username = oauthAccount.username;
		}

		await this.usersService.save(user);
		const me = UserMapper.toMeDto(user);
		const tokens = await this.tokensService.issuePairForUser(me);
		return {
			user: me,
			...tokens,
		};
	}
}
