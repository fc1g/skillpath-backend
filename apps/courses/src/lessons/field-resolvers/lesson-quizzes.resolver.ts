import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lesson, Quiz } from '@app/common';
import { QuizzesByLessonLoader } from '../data-loaders/quizzes-by-lesson.loader';

@Resolver(() => Lesson)
export class LessonQuizzesResolver {
	constructor(private readonly quizzesByLessonLoader: QuizzesByLessonLoader) {}

	@ResolveField('quizzes', () => [Quiz])
	async getQuizzesOfLesson(@Parent() lesson: Lesson) {
		return this.quizzesByLessonLoader.load(lesson.id);
	}
}
