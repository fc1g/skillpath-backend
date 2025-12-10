import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min } from 'class-validator';

@InputType()
export class PaginationQueryInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsPositive()
	limit?: number;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@Min(0)
	offset?: number;
}
