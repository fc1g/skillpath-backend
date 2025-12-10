import { CreateCourseProgressInput } from './create-course-progress.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateCourseProgressInput, UpdateCourseProgressInput)
@InputType()
export class UpdateCourseProgressInput extends PartialType(
	CreateCourseProgressInput,
) {}
