import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CourseLevel } from '@app/common/enums';
import { CreateTagInput } from '@app/common/dto';

@InputType()
export class CreateCourseInput {
	@Field()
	@ApiProperty({ maxLength: 255 })
	@IsNotEmpty()
	@MaxLength(255)
	@Expose()
	title: string;

	@Field()
	@ApiProperty({ maxLength: 255 })
	@IsNotEmpty()
	@MaxLength(255)
	@Expose()
	subtitle: string;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	description: string;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	slug: string;

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
	level: CourseLevel;

	@Field(() => [CreateTagInput])
	@ApiProperty({ type: () => [CreateTagInput] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Expose()
	tags: CreateTagInput[];
}
