import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course, Tag } from '@app/common';
import { TagsByCourseLoader } from '../data-loaders/tags-by-course.loader';

@Resolver(() => Course)
export class CourseTagsResolver {
	constructor(private readonly tagsByCourseLoader: TagsByCourseLoader) {}

	@ResolveField('tags', () => [Tag])
	async getTagsOfCourse(@Parent() course: Course) {
		return this.tagsByCourseLoader.load(course.id);
	}
}
