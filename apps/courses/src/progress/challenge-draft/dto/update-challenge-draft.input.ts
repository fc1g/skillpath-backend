import { InputType, PartialType } from '@nestjs/graphql';
import { CreateChallengeDraftInput } from './create-challenge-draft.input';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateChallengeDraftInput, UpdateChallengeDraftInput)
@InputType()
export class UpdateChallengeDraftInput extends PartialType(
	CreateChallengeDraftInput,
) {}
