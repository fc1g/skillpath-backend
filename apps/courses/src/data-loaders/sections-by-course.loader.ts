import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Course, Section } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class SectionsByCourseLoader extends DataLoader<string, Section[]> {
	constructor(
		@InjectRepository(Course)
		private readonly coursesRepository: Repository<Course>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		coursesIds: readonly string[],
	): Promise<Section[][]> {
		const coursesWithSections = await this.coursesRepository.find({
			select: {
				id: true,
			},
			relations: {
				sections: true,
			},
			where: {
				id: In(coursesIds as string[]),
			},
		});

		const courseIdToSections = new Map<string, Section[]>();
		coursesWithSections.forEach(course => {
			courseIdToSections.set(course.id, course.sections);
		});

		return coursesIds.map(courseId => courseIdToSections.get(courseId) || []);
	}
}
