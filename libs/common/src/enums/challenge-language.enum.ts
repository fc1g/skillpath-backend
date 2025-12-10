import { registerEnumType } from '@nestjs/graphql';

export enum ChallengeLanguage {
	JAVASCRIPT = 'javascript',
	TYPESCRIPT = 'typescript',
}

registerEnumType(ChallengeLanguage, {
	name: 'ChallengeLanguage',
});
