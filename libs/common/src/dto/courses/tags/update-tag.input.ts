import { CreateTagInput } from '@app/common/dto/courses/tags/create-tag.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateTagInput, UpdateTagInput)
@InputType()
export class UpdateTagInput extends PartialType(CreateTagInput) {}
