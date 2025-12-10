import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

@InputType()
export class CourseUserRatingAndProgressInput {
	@Field(() => ID)
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	userId: string;

	@Field(() => ID)
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	courseId: string;
}
