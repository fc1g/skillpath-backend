import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

@InputType()
export class CreateTagInput {
	@Field()
	@ApiProperty({ maxLength: 64 })
	@IsNotEmpty()
	@MaxLength(64)
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	@Expose()
	name: string;
}
