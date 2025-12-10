import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsResolver } from './lessons.resolver';
import { DatabaseModule, Lesson } from '@app/common';
import { LessonsRepository } from './lessons.repository';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { SectionByLessonLoader } from './data-loaders/section-by-lesson.loader';
import { LessonSectionResolver } from './field-resolvers/lesson-section.resolver';
import { QuizzesByLessonLoader } from './data-loaders/quizzes-by-lesson.loader';
import { LessonQuizzesResolver } from './field-resolvers/lesson-quizzes.resolver';

@Module({
	imports: [DatabaseModule.forFeature([Lesson]), QuizzesModule],
	providers: [
		LessonsResolver,
		LessonsService,
		LessonsRepository,
		SectionByLessonLoader,
		LessonSectionResolver,
		QuizzesByLessonLoader,
		LessonQuizzesResolver,
	],
	exports: [LessonsService],
})
export class LessonsModule {}
