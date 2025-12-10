import { CreateChallengeAttemptInput } from './create-challenge-attempt.input';
import { InputType, PartialType } from '@nestjs/graphql';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateChallengeAttemptInput, UpdateChallengeAttemptInput)
@InputType()
export class UpdateChallengeAttemptInput extends PartialType(
	CreateChallengeAttemptInput,
) {}
