import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRating } from '@app/common';
import { Type } from 'class-transformer';

@ObjectType()
export class UserRatingsWithTotalObject {
	@Field(() => [UserRating])
	@Type(() => UserRating)
	items: UserRating[];

	@Field(() => Int)
	total: number;
}
