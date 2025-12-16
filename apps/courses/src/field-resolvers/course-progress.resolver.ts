import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course, CourseProgress } from '@app/common';
import { ProgressByCourseLoader } from '../data-loaders/progress-by-course.loader';

@Resolver(() => Course)
export class CourseProgressResolver {
	constructor(
		private readonly progressByCourseLoader: ProgressByCourseLoader,
	) {}

	@ResolveField('progresses', () => CourseProgress)
	async getProgressOfCourse(@Parent() course: Course) {
		return this.progressByCourseLoader.load(course.id);
	}
}
