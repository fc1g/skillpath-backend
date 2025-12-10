import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Lesson, Section } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class SectionByLessonLoader extends DataLoader<string, Section> {
	constructor(
		@InjectRepository(Lesson)
		private readonly lessonRepository: Repository<Lesson>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(lessonsIds: readonly string[]): Promise<Section[]> {
		const lessonsWithSection = await this.lessonRepository.find({
			select: {
				id: true,
			},
			relations: {
				section: true,
			},
			where: {
				id: In(lessonsIds as string[]),
			},
		});

		return lessonsWithSection.map(lesson => lesson.section);
	}
}
