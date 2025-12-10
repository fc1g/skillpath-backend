import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Challenge } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class ChallengesWithTotalObject {
	@Field(() => [Challenge])
	@Type(() => Challenge)
	items: Challenge[];

	@Field(() => Int)
	total: number;
}
