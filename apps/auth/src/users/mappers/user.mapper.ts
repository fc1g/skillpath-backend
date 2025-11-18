import { MeDto, User } from '@app/common';

export class UserMapper {
	static toMeDto(user: User): MeDto {
		return {
			id: user.id,
			email: user.email,
			name: user.oauthAccounts?.[0]?.username ?? null,
			roles: user.roles.map(role => role.name),
			providers: user.oauthAccounts.map(oauthAccount => oauthAccount.provider),
			hasPassword: !!user?.password,
		};
	}
}
