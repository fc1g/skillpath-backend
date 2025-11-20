import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course, CreateCourseInput, UpdateCourseInput } from '@app/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Resolver(() => Course)
export class CoursesResolver {
	constructor(private readonly coursesService: CoursesService) {}

	@Mutation(() => Course, { name: 'createCourse' })
	create(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
		return this.coursesService.create(createCourseInput);
	}

	@Query(() => [Course], { name: 'courses' })
	findAll() {
		return this.coursesService.find();
	}

	@Query(() => Course, { name: 'course' })
	findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.coursesService.findOne(id);
	}

	@Mutation(() => Course, { name: 'updateCourse' })
	update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
	) {
		return this.coursesService.update(id, updateCourseInput);
	}

	@Mutation(() => Course, { name: 'removeCourse' })
	delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.coursesService.remove(id);
	}
}
