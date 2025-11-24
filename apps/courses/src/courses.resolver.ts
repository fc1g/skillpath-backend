import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import {
	Course,
	CoursesPaginationQueryInput,
	CreateCourseInput,
	PaginationQueryInput,
	UpdateCourseInput,
} from '@app/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Resolver(() => Course)
export class CoursesResolver {
	constructor(private readonly coursesService: CoursesService) {}

	@Mutation(() => Course, { name: 'createCourse' })
	async create(
		@Args('createCourseInput') createCourseInput: CreateCourseInput,
	) {
		return this.coursesService.create(createCourseInput);
	}

	@Query(() => [Course], { name: 'courses' })
	async findAll(
		@Args('coursesPaginationQueryInput')
		coursesPaginationQueryInput: CoursesPaginationQueryInput,
	) {
		return this.coursesService.find(coursesPaginationQueryInput);
	}

	@Query(() => [Course], { name: 'popularCourses' })
	async findPopularCourses(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.coursesService.findPopularCourses(paginationQueryInput);
	}

	@Query(() => Course, { name: 'course' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.coursesService.findOne(id);
	}

	@Mutation(() => Course, { name: 'updateCourse' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
	) {
		return this.coursesService.update(id, updateCourseInput);
	}

	@Mutation(() => Course, { name: 'removeCourse' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.coursesService.remove(id);
	}
}
