import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Section } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class SectionsWithTotalObject {
	@Field(() => [Section])
	@Type(() => Section)
	items: Section[];

	@Field(() => Int)
	total: number;
}
