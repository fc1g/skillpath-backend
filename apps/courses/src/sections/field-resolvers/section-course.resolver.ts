import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course, Section } from '@app/common';
import { CourseBySectionLoader } from '../data-loaders/course-by-section.loader';

@Resolver(() => Section)
export class SectionCourseResolver {
	constructor(private readonly courseBySectionLoader: CourseBySectionLoader) {}

	@ResolveField('course', () => Course)
	async getCourseOfSection(@Parent() section: Section) {
		return this.courseBySectionLoader.load(section.id);
	}
}
