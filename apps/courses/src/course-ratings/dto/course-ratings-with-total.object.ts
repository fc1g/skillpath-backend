import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CourseRating } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class CourseRatingsWithTotalObject {
	@Field(() => [CourseRating])
	@Type(() => CourseRating)
	items: CourseRating[];

	@Field(() => Int)
	total: number;
}
