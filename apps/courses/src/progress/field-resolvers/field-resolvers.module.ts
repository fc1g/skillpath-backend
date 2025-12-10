import { Module } from '@nestjs/common';
import { ChallengesByCourseLoader } from '../data-loaders/challenges-by-course.loader';
import { LessonsByCourseLoader } from '../data-loaders/lessons-by-course.loader';
import { CourseChallengesResolver } from './course-challenges.resolver';
import { CourseLessonsResolver } from './course-lessons.resolver';
import { CourseProgress, DatabaseModule, LessonProgress } from '@app/common';

@Module({
	imports: [DatabaseModule.forFeature([CourseProgress, LessonProgress])],
	providers: [
		ChallengesByCourseLoader,
		LessonsByCourseLoader,
		CourseChallengesResolver,
		CourseLessonsResolver,
	],
	exports: [CourseChallengesResolver, CourseLessonsResolver],
})
export class FieldResolversModule {}
