import { Category, Course } from '@app/common';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class CategoriesByCourseLoader extends DataLoader<string, Category[]> {
	constructor(
		@InjectRepository(Course)
		private readonly coursesRepository: Repository<Course>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		coursesIds: readonly string[],
	): Promise<Category[][]> {
		const coursesWithCategories = await this.coursesRepository.find({
			select: {
				id: true,
			},
			relations: {
				categories: true,
			},
			where: {
				id: In(coursesIds as string[]),
			},
		});

		const courseIdToCategories = new Map<string, Category[]>();
		coursesWithCategories.forEach(course => {
			courseIdToCategories.set(course.id, course.categories);
		});

		return coursesIds.map(courseId => courseIdToCategories.get(courseId) || []);
	}
}
