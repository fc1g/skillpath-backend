import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CourseProgress, LessonProgress } from '@app/common';
import { LessonsByCourseProgressLoader } from '../data-loaders/lessons-by-course-progress.loader';

@Resolver(() => CourseProgress)
export class CourseLessonsResolver {
	constructor(
		private readonly lessonsByCourseProgressLoader: LessonsByCourseProgressLoader,
	) {}

	@ResolveField('lessonsProgresses', () => [LessonProgress])
	async getLessonsOfCourse(@Parent() courseProgress: CourseProgress) {
		return this.lessonsByCourseProgressLoader.load(courseProgress.id);
	}
}
