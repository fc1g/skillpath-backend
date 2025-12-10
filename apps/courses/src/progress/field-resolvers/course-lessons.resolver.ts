import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CourseProgress, LessonProgress } from '@app/common';
import { LessonsByCourseLoader } from '../data-loaders/lessons-by-course.loader';

@Resolver(() => CourseProgress)
export class CourseLessonsResolver {
	constructor(private readonly lessonsByCourseLoader: LessonsByCourseLoader) {}

	@ResolveField('lessonsProgresses', () => [LessonProgress])
	async getLessonsOfCourse(@Parent() courseProgress: CourseProgress) {
		return this.lessonsByCourseLoader.load(courseProgress.id);
	}
}
