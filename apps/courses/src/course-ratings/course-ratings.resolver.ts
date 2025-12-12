import {
	CourseRating,
	CurrentUser,
	JwtAuthGuard,
	MeDto,
	PaginationQueryInput,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { CreateCourseRatingInput } from './dto/create-course-rating.input';
import { CourseRatingsWithTotalObject } from './dto/course-ratings-with-total.object';
import { CourseRatingsService } from './course-ratings.service';

@ApiTags('CourseRatings')
@Resolver(() => CourseRating)
export class CourseRatingsResolver {
	constructor(private readonly courseRatingsService: CourseRatingsService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => CourseRating, { name: 'rateCourse' })
	async rateCourse(
		@CurrentUser() user: MeDto,
		@Args('createCourseRatingInput')
		createCourseRatingInput: CreateCourseRatingInput,
	) {
		return this.courseRatingsService.rateCourse(user, createCourseRatingInput);
	}

	@Query(() => CourseRatingsWithTotalObject, { name: 'courseRatings' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.courseRatingsService.find(paginationQueryInput);
	}

	@Query(() => CourseRating, { name: 'courseRating' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.courseRatingsService.findOne(id);
	}

	@UseGuards(JwtAuthGuard)
	@Query(() => CourseRating, { name: 'courseRatingBy', nullable: true })
	async findOneBy(
		@CurrentUser() user: MeDto,
		@Args('courseId', { type: () => ID }, ParseUUIDPipe) courseId: string,
	) {
		return this.courseRatingsService.findOneBy({
			userId: user.id,
			courseId,
		});
	}
}
