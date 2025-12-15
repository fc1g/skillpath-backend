import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
	@IsOptional()
	@IsPositive()
	@Min(0)
	limit?: number;

	@IsOptional()
	@IsPositive()
	@Min(0)
	offset?: number;
}
