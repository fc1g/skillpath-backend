import { CreateCourseInput } from '@app/common/dto/courses/create-course.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateCourseInput, UpdateCourseInput)
@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {}
