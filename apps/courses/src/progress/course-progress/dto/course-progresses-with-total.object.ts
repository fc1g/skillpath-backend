import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CourseProgress } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class CourseProgressesWithTotalObject {
	@Field(() => [CourseProgress])
	@Type(() => CourseProgress)
	items: CourseProgress[];

	@Field(() => Int)
	total: number;
}
