import { Course, Tag } from '@app/common';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TagsByCourseLoader extends DataLoader<string, Tag[]> {
	constructor(
		@InjectRepository(Course)
		private readonly coursesRepository: Repository<Course>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(coursesIds: readonly string[]): Promise<Tag[][]> {
		const coursesWithTags = await this.coursesRepository.find({
			select: {
				id: true,
			},
			relations: {
				tags: true,
			},
			where: {
				id: In(coursesIds as string[]),
			},
		});

		const courseIdToTags = new Map<string, Tag[]>();
		coursesWithTags.forEach(course => {
			courseIdToTags.set(course.id, course.tags);
		});

		return coursesIds.map(courseId => courseIdToTags.get(courseId) || []);
	}
}
