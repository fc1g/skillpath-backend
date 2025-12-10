import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class CategoriesWithTotalObject {
	@Field(() => [Category])
	@Type(() => Category)
	items: Category[];

	@Field(() => Int)
	total: number;
}
