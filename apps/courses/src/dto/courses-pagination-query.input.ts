import { CourseLevel, PaginationQueryInput } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

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
