import { registerEnumType } from '@nestjs/graphql';

export enum ChallengeDifficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
}

registerEnumType(ChallengeDifficulty, {
	name: 'ChallengeDifficulty',
});
