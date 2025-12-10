import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { CourseProgress, LessonProgress } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class LessonsByCourseLoader extends DataLoader<
	string,
	LessonProgress[]
> {
	constructor(
		@InjectRepository(CourseProgress)
		private readonly courseProgressRepository: Repository<CourseProgress>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		coursesIds: readonly string[],
	): Promise<LessonProgress[][]> {
		const coursesWithLessons = await this.courseProgressRepository.find({
			select: {
				id: true,
			},
			relations: {
				lessonsProgresses: true,
			},
			where: {
				id: In(coursesIds as string[]),
			},
		});

		return coursesWithLessons.map(course => course.lessonsProgresses);
	}
}
