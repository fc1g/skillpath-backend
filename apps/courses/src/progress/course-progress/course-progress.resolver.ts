import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseProgressService } from './course-progress.service';
import {
	CourseProgress,
	CurrentUser,
	JwtAuthGuard,
	PaginationQueryInput,
	User,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UpdateCourseProgressInput } from './dto/update-course-progress.input';
import { CreateCourseProgressInput } from './dto/create-course-progress.input';
import { CourseProgressesWithTotalObject } from './dto/course-progresses-with-total.object';

@UseGuards(JwtAuthGuard)
@Resolver(() => CourseProgress)
export class CourseProgressResolver {
	constructor(private readonly courseProgressService: CourseProgressService) {}

	@Mutation(() => CourseProgress, { name: 'createCourseProgress' })
	async create(
		@CurrentUser() user: User,
		@Args('createCourseProgressInput')
		createCourseProgressInput: CreateCourseProgressInput,
	) {
		return this.courseProgressService.preloadCourseProgress({
			...createCourseProgressInput,
			userId: user.id,
		});
	}

	@Query(() => CourseProgressesWithTotalObject, { name: 'courseProgresses' })
	async findAll(
		@CurrentUser() user: User,
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.courseProgressService.find(user.id, paginationQueryInput);
	}

	@Query(() => CourseProgressesWithTotalObject, { name: 'completedCourses' })
	async findCompletedCourses(
		@CurrentUser() user: User,
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.courseProgressService.findCompletedCourses(
			user.id,
			paginationQueryInput,
		);
	}

	@Query(() => CourseProgress, { name: 'courseProgress' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.courseProgressService.findOne(id);
	}

	@Query(() => CourseProgress, { name: 'courseProgressBy' })
	async findOneBy(
		@CurrentUser() user: User,
		@Args('courseId', { type: () => ID }, ParseUUIDPipe) courseId: string,
	) {
		return this.courseProgressService.findOneBy({
			userId: user.id,
			course: {
				id: courseId,
			},
		});
	}

	@Query(() => CourseProgress, { name: 'lastVisitedCourse' })
	async findLastVisitedCourse(@CurrentUser() user: User) {
		return this.courseProgressService.findLastVisitedCourse(user.id);
	}

	@Mutation(() => CourseProgress, { name: 'updateCourseProgress' })
	async update(
		@CurrentUser() user: User,
		@Args('updateCourseProgressInput')
		updateCourseProgressInput: UpdateCourseProgressInput,
	) {
		return this.courseProgressService.update(
			user.id,
			updateCourseProgressInput,
		);
	}

	@Mutation(() => CourseProgress, { name: 'removeCourseProgress' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.courseProgressService.remove(id);
	}
}
