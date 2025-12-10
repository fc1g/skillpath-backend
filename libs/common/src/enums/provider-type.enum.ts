import { registerEnumType } from '@nestjs/graphql';

export enum ProviderType {
	GITHUB = 'github',
	GOOGLE = 'google',
}

registerEnumType(ProviderType, { name: 'ProviderType' });
