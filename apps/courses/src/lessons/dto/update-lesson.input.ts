import { CreateLessonInput } from './create-lesson.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateLessonInput, UpdateLessonInput)
@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {}
