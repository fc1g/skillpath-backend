import { Module } from '@nestjs/common';
import { ChallengesByCourseProgressLoader } from '../data-loaders/challenges-by-course-progress.loader';
import { LessonsByCourseProgressLoader } from '../data-loaders/lessons-by-course-progress.loader';
import { CourseChallengesResolver } from './course-challenges.resolver';
import { CourseLessonsResolver } from './course-lessons.resolver';
import { CourseProgress, DatabaseModule, LessonProgress } from '@app/common';
import { CourseByCourseProgressLoader } from '../data-loaders/course-by-course-progress.loader';
import { CourseProgressCourseResolver } from './course-progress-course.resolver';

@Module({
	imports: [DatabaseModule.forFeature([CourseProgress, LessonProgress])],
	providers: [
		ChallengesByCourseProgressLoader,
		LessonsByCourseProgressLoader,
		CourseByCourseProgressLoader,
		CourseChallengesResolver,
		CourseLessonsResolver,
		CourseProgressCourseResolver,
	],
	exports: [
		CourseChallengesResolver,
		CourseLessonsResolver,
		CourseProgressCourseResolver,
	],
})
export class FieldResolversModule {}
