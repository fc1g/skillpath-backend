import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseProgressService } from './course-progress.service';
import {
	CourseProgress,
	CurrentUser,
	JwtAuthGuard,
	MeDto,
	PaginationQueryInput,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UpdateCourseProgressInput } from './dto/update-course-progress.input';
import { CreateCourseProgressInput } from './dto/create-course-progress.input';
import { CourseProgressesWithTotalObject } from './dto/course-progresses-with-total.object';

@Resolver(() => CourseProgress)
export class CourseProgressResolver {
	constructor(private readonly courseProgressService: CourseProgressService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => CourseProgress, { name: 'createCourseProgress' })
	async create(
		@CurrentUser() user: MeDto,
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
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.courseProgressService.find(paginationQueryInput);
	}

	@Query(() => CourseProgress, { name: 'courseProgress' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.courseProgressService.findOne(id);
	}

	@UseGuards(JwtAuthGuard)
	@Query(() => CourseProgress, { name: 'courseProgressBy' })
	async findOneBy(
		@CurrentUser() user: MeDto,
		@Args('courseId', { type: () => ID }, ParseUUIDPipe) courseId: string,
	) {
		return this.courseProgressService.findOneBy({
			userId: user.id,
			courseId,
		});
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => CourseProgress, { name: 'updateCourseProgress' })
	async update(
		@CurrentUser() user: MeDto,
		@Args('updateCourseProgressInput')
		updateCourseProgressInput: UpdateCourseProgressInput,
	) {
		return this.courseProgressService.update(
			user.id,
			updateCourseProgressInput,
		);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => CourseProgress, { name: 'removeCourseProgress' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.courseProgressService.remove(id);
	}
}
