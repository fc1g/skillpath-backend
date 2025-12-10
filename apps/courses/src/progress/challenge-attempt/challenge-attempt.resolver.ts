import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChallengeAttemptService } from './challenge-attempt.service';
import { ChallengeAttempt, PaginationQueryInput } from '@app/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateChallengeAttemptInput } from './dto/update-challenge-attempt.input';
import { CreateChallengeAttemptInput } from './dto/create-challenge-attempt.input';

@Resolver(() => ChallengeAttempt)
export class ChallengeAttemptResolver {
	constructor(
		private readonly challengeAttemptService: ChallengeAttemptService,
	) {}

	@Mutation(() => ChallengeAttempt, { name: 'createChallengeAttempt' })
	async create(
		@Args('createChallengeAttemptInput')
		createChallengeAttemptInput: CreateChallengeAttemptInput,
	) {
		return this.challengeAttemptService.create(createChallengeAttemptInput);
	}

	@Query(() => [ChallengeAttempt], { name: 'challengeAttempts' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.challengeAttemptService.find(paginationQueryInput);
	}

	@Query(() => ChallengeAttempt, { name: 'challengeAttempt' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.challengeAttemptService.findOne(id);
	}

	@Mutation(() => ChallengeAttempt, { name: 'updateChallengeAttempt' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateChallengeAttemptInput')
		updateChallengeAttemptInput: UpdateChallengeAttemptInput,
	) {
		return this.challengeAttemptService.update(id, updateChallengeAttemptInput);
	}

	@Mutation(() => ChallengeAttempt, { name: 'removeChallengeAttempt' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.challengeAttemptService.remove(id);
	}
}
