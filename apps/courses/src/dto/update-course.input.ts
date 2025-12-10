import { CreateCourseInput } from './create-course.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateCourseInput, UpdateCourseInput)
@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {}
