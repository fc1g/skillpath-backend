import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Challenge, Section } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ChallengesBySectionLoader extends DataLoader<string, Challenge[]> {
	constructor(
		@InjectRepository(Section)
		private readonly sectionRepository: Repository<Section>,
	) {
		super(keys => this.batchLoadFn(keys));
	}

	private async batchLoadFn(
		sectionIds: readonly string[],
	): Promise<Challenge[][]> {
		const sectionsWithChallenges = await this.sectionRepository.find({
			select: {
				id: true,
			},
			relations: {
				challenges: true,
			},
			where: {
				id: In(sectionIds as string[]),
			},
		});

		const sectionIdToChallenges = new Map<string, Challenge[]>();
		sectionsWithChallenges.forEach(section => {
			sectionIdToChallenges.set(section.id, section.challenges);
		});

		return sectionIds.map(
			sectionId => sectionIdToChallenges.get(sectionId) || [],
		);
	}
}
