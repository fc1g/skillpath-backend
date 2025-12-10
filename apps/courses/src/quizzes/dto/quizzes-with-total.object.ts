import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Quiz } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class QuizzesWithTotalObject {
	@Field(() => [Quiz])
	@Type(() => Quiz)
	items: Quiz[];

	@Field(() => Int)
	total: number;
}
