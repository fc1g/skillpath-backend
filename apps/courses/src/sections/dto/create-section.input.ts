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
import { CreateLessonInput } from '../../lessons/dto/create-lesson.input';
import { CreateChallengeInput } from '../../challenges/dto/create-challenge.input';

@InputType()
export class CreateSectionInput {
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

	@Field(() => [CreateLessonInput])
	@ApiProperty({ type: () => [CreateLessonInput] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Type(() => CreateLessonInput)
	@Expose()
	lessons: CreateLessonInput[];

	@Field(() => [CreateChallengeInput])
	@ApiProperty({ type: () => [CreateChallengeInput] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Type(() => CreateChallengeInput)
	@Expose()
	challenges: CreateChallengeInput[];

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	courseId?: string;
}
