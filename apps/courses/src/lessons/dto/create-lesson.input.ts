import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsOptional,
	MaxLength,
	Min,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { CreateQuizInput } from '../../quizzes/dto/create-quiz.input';

@InputType()
export class CreateLessonInput {
	@Field()
	@ApiProperty({ maxLength: 255 })
	@IsNotEmpty()
	@MaxLength(255)
	@Expose()
	@Transform(({ value }: { value: string }) => value.trim())
	title: string;

	@Field(() => Int)
	@ApiProperty({ minimum: 0 })
	@Min(0)
	@IsNotEmpty()
	@Expose()
	order: number;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	content: string;

	@Field(() => Int)
	@ApiProperty({ minimum: 0 })
	@IsNotEmpty()
	@Expose()
	@Min(0)
	durationSeconds: number;

	@Field(() => [CreateQuizInput])
	@ApiProperty({ type: () => [CreateQuizInput] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Type(() => CreateQuizInput)
	@Expose()
	quizzes: CreateQuizInput[];

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	sectionId?: string;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	courseId?: string;
}
