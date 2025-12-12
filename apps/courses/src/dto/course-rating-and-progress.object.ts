import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CourseProgress } from '@app/common';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class CourseRatingAndProgressObject {
	@Field(() => Int, { nullable: true })
	@Expose()
	rating: number | null;

	@Field(() => String, { nullable: true })
	@Expose()
	review: string | null;

	@Field(() => CourseProgress)
	@Type(() => CourseProgress)
	@Expose()
	progress: CourseProgress;
}
