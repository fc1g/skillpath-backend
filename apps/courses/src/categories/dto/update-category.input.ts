import { CreateCategoryInput } from './create-category.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateCategoryInput, UpdateCategoryInput)
@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
