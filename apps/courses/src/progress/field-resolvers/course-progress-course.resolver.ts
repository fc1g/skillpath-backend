import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course, CourseProgress } from '@app/common';
import { CourseByCourseProgressLoader } from '../data-loaders/course-by-course-progress.loader';

@Resolver(() => CourseProgress)
export class CourseProgressCourseResolver {
	constructor(
		private readonly courseByCourseProgressLoader: CourseByCourseProgressLoader,
	) {}

	@ResolveField('course', () => Course)
	async getCourseOfCourseProgress(@Parent() courseProgress: CourseProgress) {
		return this.courseByCourseProgressLoader.load(courseProgress.id);
	}
}
