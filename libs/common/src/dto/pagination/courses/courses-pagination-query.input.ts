import { Field, InputType } from '@nestjs/graphql';
import { PaginationQueryInput } from '@app/common/dto/pagination/pagination-query.input';
import { IsOptional } from 'class-validator';
import { CourseLevel } from '@app/common/enums';
import { Transform } from 'class-transformer';

@InputType()
export class CoursesPaginationQueryInput extends PaginationQueryInput {
	@Field()
	@IsOptional()
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	level?: CourseLevel;

	@Field()
	@IsOptional()
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	category?: string;

	@Field()
	@IsOptional()
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	search?: string;
}
