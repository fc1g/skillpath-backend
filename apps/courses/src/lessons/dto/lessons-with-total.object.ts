import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Lesson } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class LessonsWithTotalObject {
	@Field(() => [Lesson])
	@Type(() => Lesson)
	items: Lesson[];

	@Field(() => Int)
	total: number;
}
