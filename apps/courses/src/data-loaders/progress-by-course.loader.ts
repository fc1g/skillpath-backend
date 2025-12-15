import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Course, CourseProgress } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ProgressByCourseLoader extends DataLoader<string, CourseProgress> {
	constructor(
		@InjectRepository(Course)
		private readonly coursesRepository: Repository<Course>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		coursesIds: readonly string[],
	): Promise<CourseProgress[]> {
		const coursesWithProgress = await this.coursesRepository.find({
			select: {
				id: true,
			},
			relations: {
				progress: true,
			},
			where: {
				id: In(coursesIds as string[]),
			},
		});

		return coursesWithProgress.map(course => course.progress);
	}
}
