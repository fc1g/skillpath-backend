import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChallengeDraftService } from './challenge-draft.service';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ChallengeDraft, CurrentUser, JwtAuthGuard, User } from '@app/common';
import { UpdateChallengeDraftInput } from './dto/update-challenge-draft.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => ChallengeDraft)
export class ChallengeDraftResolver {
	constructor(private readonly challengeDraftService: ChallengeDraftService) {}

	@Query(() => ChallengeDraft, { name: 'challengeDraft' })
	async findOne(
		@CurrentUser() user: User,
		@Args('challengeId', { type: () => ID }, ParseUUIDPipe) challengeId: string,
	) {
		return this.challengeDraftService.findOne(user.id, challengeId);
	}

	@Mutation(() => ChallengeDraft, { name: 'updateChallengeDraft' })
	async update(
		@CurrentUser() user: User,
		@Args('updateChallengeDraftInput')
		updateChallengeDraftInput: UpdateChallengeDraftInput,
	) {
		return this.challengeDraftService.update({
			...updateChallengeDraftInput,
			userId: user.id,
		});
	}
}
