import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChallengesService } from './challenges.service';
import {
	Challenge,
	JwtAuthGuard,
	PaginationQueryInput,
	Roles,
	RoleType,
} from '@app/common';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UpdateChallengeInput } from './dto/update-challenge.input';
import { ChallengesWithTotalObject } from './dto/challenges-with-total.object';

@Resolver(() => Challenge)
export class ChallengesResolver {
	constructor(private readonly challengesService: ChallengesService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Challenge, { name: 'createChallenge' })
	async create(
		@Args('createChallengeInput') createChallengeInput: CreateChallengeInput,
	) {
		return this.challengesService.preloadChallenge(createChallengeInput);
	}

	@Query(() => ChallengesWithTotalObject, { name: 'challenges' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.challengesService.find(paginationQueryInput);
	}

	@Query(() => Challenge, { name: 'challenge' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.challengesService.findOne(id);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Challenge, { name: 'updateChallenge' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateChallengeInput') updateChallengeInput: UpdateChallengeInput,
	) {
		return this.challengesService.update(id, updateChallengeInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Challenge, { name: 'removeChallenge' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.challengesService.remove(id);
	}
}
