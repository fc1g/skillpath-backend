import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Course, Section } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class CourseBySectionLoader extends DataLoader<string, Course> {
	constructor(
		@InjectRepository(Section)
		private readonly sectionsRepository: Repository<Section>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(sectionIds: readonly string[]): Promise<Course[]> {
		const sectionsWithCourse = await this.sectionsRepository.find({
			select: {
				id: true,
			},
			relations: {
				course: true,
			},
			where: {
				id: In(sectionIds as string[]),
			},
		});

		return sectionsWithCourse.map(section => section.course);
	}
}
