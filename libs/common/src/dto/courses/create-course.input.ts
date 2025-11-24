import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { CourseLevel } from '@app/common/enums';
import { CreateCategoryInput, CreateTagInput } from '@app/common/dto';

@InputType()
export class CreateCourseInput {
	@Field()
	@ApiProperty({ maxLength: 255 })
	@IsNotEmpty()
	@MaxLength(255)
	@Expose()
	@Transform(({ value }: { value: string }) => value.trim())
	title: string;

	@Field()
	@ApiProperty({ maxLength: 255 })
	@IsNotEmpty()
	@MaxLength(255)
	@Expose()
	@Transform(({ value }: { value: string }) => value.trim())
	subtitle: string;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	@Transform(({ value }: { value: string }) => value.trim())
	description: string;

	@Field(() => [String])
	@ApiProperty({ type: [String] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Expose()
	requirements: string[];

	@Field(() => [String])
	@ApiProperty({ type: [String] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Expose()
	learningOutcomes: string[];

	@Field(() => [String])
	@ApiProperty({ type: [String] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Expose()
	includedFeatures: string[];

	@Field(() => CourseLevel)
	@ApiProperty({
		description: 'Intended difficulty level of the course',
		enum: CourseLevel,
		enumName: 'CourseLevel',
		example: CourseLevel.BEGINNER,
	})
	@IsNotEmpty()
	@Expose()
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	level: CourseLevel;

	@Field(() => [CreateTagInput])
	@ApiProperty({ type: () => [CreateTagInput] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Type(() => CreateTagInput)
	@Expose()
	tags: CreateTagInput[];

	@Field(() => [CreateCategoryInput])
	@ApiProperty({ type: () => [CreateCategoryInput] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Type(() => CreateCategoryInput)
	@Expose()
	categories: CreateCategoryInput[];
}
