import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LessonProgress } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class LessonProgressesWithTotalObject {
	@Field(() => [LessonProgress])
	@Type(() => LessonProgress)
	items: LessonProgress[];

	@Field(() => Int)
	total: number;
}
