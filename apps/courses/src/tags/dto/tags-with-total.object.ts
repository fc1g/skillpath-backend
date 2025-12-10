import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class TagsWithTotalObject {
	@Field(() => [Tag])
	@Type(() => Tag)
	items: Tag[];

	@Field(() => Int)
	total: number;
}
