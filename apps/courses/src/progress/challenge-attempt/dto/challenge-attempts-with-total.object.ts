import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChallengeAttempt } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class ChallengeAttemptsWithTotalObject {
	@Field(() => [ChallengeAttempt])
	@Type(() => ChallengeAttempt)
	items: ChallengeAttempt[];

	@Field(() => Int)
	total: number;
}
