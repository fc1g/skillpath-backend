import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';

@InputType()
export class CreateCourseRatingInput {
	@Field(() => ID)
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	courseId: string;

	@Field(() => Int)
	@ApiProperty()
	@IsNotEmpty()
	@Min(1)
	@Max(5)
	@Expose()
	rating: number;

	@Field()
	@ApiProperty()
	@IsOptional()
	@Expose()
	review?: string;
}
