import { Field, ID, InputType } from '@nestjs/graphql';
import { CourseProgressStatus } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { LastVisitedItemType } from '@app/common/enums/last-visited-item-type.enum';

@InputType()
export class CreateCourseProgressInput {
	@Field(() => CourseProgressStatus)
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	status: CourseProgressStatus;

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
	courseId: string;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@IsUUID()
	@Expose()
	lastVisitedItemId: string | null;

	@Field(() => LastVisitedItemType, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	lastVisitedItemType: LastVisitedItemType | null;

	@Field(() => Date)
	@ApiProperty()
	@IsNotEmpty()
	@IsDate()
	@Expose()
	@Type(() => Date)
	lastAccessedAt: Date;
}
