import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Min } from 'class-validator';

@InputType()
export class PaginationQueryInput {
	@Field(() => Int)
	@IsOptional()
	@IsPositive()
	limit?: number;

	@Field(() => Int)
	@IsOptional()
	@Min(0)
	offset?: number;
}
