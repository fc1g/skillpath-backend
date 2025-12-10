import { CreateSectionInput } from './create-section.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateSectionInput, UpdateSectionInput)
@InputType()
export class UpdateSectionInput extends PartialType(CreateSectionInput) {}
