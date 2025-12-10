import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { QuizType } from '@app/common';

@InputType()
export class CreateQuizInput {
	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	question: string;

	@Field(() => QuizType)
	@ApiProperty({ enum: QuizType, enumName: 'QuizType' })
	@IsNotEmpty()
	@IsEnum(QuizType)
	@Expose()
	type: QuizType;

	@Field(() => [String])
	@ApiProperty({ type: [String] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Expose()
	options: string[];

	@Field(() => Int)
	@ApiProperty()
	@IsNotEmpty()
	@Min(0)
	@Expose()
	correctOptionIndex: number;

	@Field(() => String, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	explanation?: string | null;

	@Field(() => Int)
	@ApiProperty()
	@IsNotEmpty()
	@Min(0)
	@Expose()
	order: number;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	lessonId?: string;
}
