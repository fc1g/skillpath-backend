import { CreateChallengeInput } from './create-challenge.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateChallengeInput, UpdateChallengeInput)
@InputType()
export class UpdateChallengeInput extends PartialType(CreateChallengeInput) {}
