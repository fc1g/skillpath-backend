import {
	Course,
	JwtAuthGuard,
	PaginationQueryInput,
	Roles,
	RoleType,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CoursesPaginationQueryInput } from './dto/courses-pagination-query.input';
import { CoursesWithTotalObject } from './dto/courses-with-total.object';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';

@ApiTags('Courses')
@Resolver(() => Course)
export class CoursesResolver {
	constructor(private readonly coursesService: CoursesService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Course, { name: 'createCourse' })
	async create(
		@Args('createCourseInput') createCourseInput: CreateCourseInput,
	) {
		return this.coursesService.create(createCourseInput);
	}

	@Query(() => CoursesWithTotalObject, { name: 'courses' })
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

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Course, { name: 'updateCourse' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
	) {
		return this.coursesService.update(id, updateCourseInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Course, { name: 'removeCourse' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.coursesService.remove(id);
	}
}
