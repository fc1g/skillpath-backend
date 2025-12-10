import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course, Section } from '@app/common';
import { SectionsByCourseLoader } from '../data-loaders/sections-by-course.loader';

@Resolver(() => Course)
export class CourseSectionsResolver {
	constructor(
		private readonly sectionsByCourseLoader: SectionsByCourseLoader,
	) {}

	@ResolveField('sections', () => [Section])
	async getSectionsOfCourse(@Parent() course: Course) {
		return this.sectionsByCourseLoader.load(course.id);
	}
}
