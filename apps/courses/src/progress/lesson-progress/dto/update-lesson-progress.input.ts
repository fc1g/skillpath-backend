import { CreateLessonProgressInput } from './create-lesson-progress.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

@ApiExtraModels(CreateLessonProgressInput, UpdateLessonProgressInput)
@InputType()
export class UpdateLessonProgressInput extends PartialType(
	CreateLessonProgressInput,
) {
	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@Optional()
	@IsUUID()
	@Expose()
	courseId: string;
}
