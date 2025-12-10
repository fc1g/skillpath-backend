import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Lesson, Section } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class LessonsBySectionLoader extends DataLoader<string, Lesson[]> {
	constructor(
		@InjectRepository(Section)
		private readonly sectionsRepository: Repository<Section>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		sectionIds: readonly string[],
	): Promise<Lesson[][]> {
		const sectionsWithLessons = await this.sectionsRepository.find({
			select: {
				id: true,
			},
			relations: {
				lessons: true,
			},
			where: {
				id: In(sectionIds as string[]),
			},
		});

		const sectionIdToLessons = new Map<string, Lesson[]>();
		sectionsWithLessons.forEach(section => {
			sectionIdToLessons.set(section.id, section.lessons);
		});

		return sectionIds.map(sectionId => sectionIdToLessons.get(sectionId) || []);
	}
}
