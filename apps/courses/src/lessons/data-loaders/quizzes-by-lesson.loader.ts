import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Lesson, Quiz } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class QuizzesByLessonLoader extends DataLoader<string, Quiz[]> {
	constructor(
		@InjectRepository(Lesson)
		private readonly lessonRepository: Repository<Lesson>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(lessonsIds: readonly string[]): Promise<Quiz[][]> {
		const lessonsWithQuizzes = await this.lessonRepository.find({
			select: {
				id: true,
			},
			relations: {
				quizzes: true,
			},
			where: {
				id: In(lessonsIds as string[]),
			},
		});

		const lessonIdToQuizzes = new Map<string, Quiz[]>();
		lessonsWithQuizzes.forEach(lesson => {
			lessonIdToQuizzes.set(lesson.id, lesson.quizzes);
		});

		return lessonsIds.map(lessonId => lessonIdToQuizzes.get(lessonId) || []);
	}
}
