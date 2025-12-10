import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseProgressService } from './course-progress.service';
import { CourseProgress, PaginationQueryInput } from '@app/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateCourseProgressInput } from './dto/update-course-progress.input';
import { CreateCourseProgressInput } from './dto/create-course-progress.input';
import { CourseProgressesWithTotalObject } from './dto/course-progresses-with-total.object';

@Resolver(() => CourseProgress)
export class CourseProgressResolver {
	constructor(private readonly courseProgressService: CourseProgressService) {}

	@Mutation(() => CourseProgress, { name: 'createCourseProgress' })
	async create(
		@Args('createCourseProgressInput')
		createCourseProgressInput: CreateCourseProgressInput,
	) {
		return this.courseProgressService.preloadCourseProgress(
			createCourseProgressInput,
		);
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

	@Mutation(() => CourseProgress, { name: 'updateCourseProgress' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateCourseProgressInput')
		updateCourseProgressInput: UpdateCourseProgressInput,
	) {
		return this.courseProgressService.update(id, updateCourseProgressInput);
	}

	@Mutation(() => CourseProgress, { name: 'removeCourseProgress' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.courseProgressService.remove(id);
	}
}
