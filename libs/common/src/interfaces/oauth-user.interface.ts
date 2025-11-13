import { ProviderType } from '@app/common/enums';

export interface OAuthUser {
	provider: ProviderType;
	providerId: string;
	email: string;
	username?: string;
}
