import { Field, ID, InputType } from '@nestjs/graphql';
import { LessonProgressStatus } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { Optional } from '@nestjs/common';

@InputType()
export class CreateLessonProgressInput {
	@Field(() => LessonProgressStatus)
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	status: LessonProgressStatus;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@Optional()
	@IsUUID()
	@Expose()
	courseProgressId: string | null;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@IsUUID()
	@Expose()
	userId?: string;

	@Field(() => ID)
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	lessonId: string;
}
