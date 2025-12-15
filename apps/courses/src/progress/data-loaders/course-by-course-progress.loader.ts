import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Course, CourseProgress } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class CourseByCourseProgressLoader extends DataLoader<string, Course> {
	constructor(
		@InjectRepository(CourseProgress)
		private readonly courseProgressRepository: Repository<CourseProgress>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		courseProgressIds: readonly string[],
	): Promise<Course[]> {
		const coursesWithProgress = await this.courseProgressRepository.find({
			select: {
				id: true,
			},
			relations: {
				course: true,
			},
			where: {
				id: In(courseProgressIds as string[]),
			},
		});

		return coursesWithProgress.map(courseProgress => courseProgress.course);
	}
}
