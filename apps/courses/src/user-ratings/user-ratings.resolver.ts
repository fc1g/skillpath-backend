import {
	CurrentUser,
	JwtAuthGuard,
	MeDto,
	PaginationQueryInput,
	UserRating,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserRatingInput } from './dto/create-user-rating.input';
import { UserRatingsService } from './user-ratings.service';

@ApiTags('UserRatings')
@Resolver(() => UserRating)
export class UserRatingsResolver {
	constructor(private readonly userRatingsService: UserRatingsService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => UserRating, { name: 'rateCourse' })
	async rateCourse(
		@CurrentUser() user: MeDto,
		@Args('createUserRatingInput') createUserRatingInput: CreateUserRatingInput,
	) {
		return this.userRatingsService.rateCourse(user, createUserRatingInput);
	}

	@Query(() => [UserRating], { name: 'userRatings' })
	findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.userRatingsService.find(paginationQueryInput);
	}

	@Query(() => UserRating, { name: 'userRating' })
	findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.userRatingsService.findOne(id);
	}
}
