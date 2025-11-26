import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Course } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class CoursesWithTotalObject {
	@Field(() => [Course])
	@Type(() => Course)
	items: Course[];

	@Field(() => Int)
	total: number;
}
