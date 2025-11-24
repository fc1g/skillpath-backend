import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

@InputType()
export class CreateCategoryInput {
	@Field()
	@ApiProperty({ maxLength: 128 })
	@IsNotEmpty()
	@MaxLength(128)
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	@Expose()
	name: string;
}
