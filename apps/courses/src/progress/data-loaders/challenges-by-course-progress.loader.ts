import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ChallengeAttempt, CourseProgress } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ChallengesByCourseProgressLoader extends DataLoader<
	string,
	ChallengeAttempt[]
> {
	constructor(
		@InjectRepository(CourseProgress)
		private readonly courseProgressRepository: Repository<CourseProgress>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		coursesIds: readonly string[],
	): Promise<ChallengeAttempt[][]> {
		const coursesWithChallenges = await this.courseProgressRepository.find({
			select: {
				id: true,
			},
			relations: {
				challengesAttempts: true,
			},
			where: {
				id: In(coursesIds as string[]),
			},
		});

		const courseIdToChallenges = new Map<string, ChallengeAttempt[]>();
		coursesWithChallenges.forEach(course => {
			courseIdToChallenges.set(course.id, course.challengesAttempts);
		});

		return coursesIds.map(courseId => courseIdToChallenges.get(courseId) || []);
	}
}
