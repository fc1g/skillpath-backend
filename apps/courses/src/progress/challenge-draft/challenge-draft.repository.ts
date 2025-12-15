import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, ChallengeDraft } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ChallengeDraftRepository extends AbstractRepository<ChallengeDraft> {
	protected readonly logger: Logger = new Logger(ChallengeDraftRepository.name);

	constructor(
		@InjectRepository(ChallengeDraft) repo: Repository<ChallengeDraft>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Challenge draft not found');
	}
}
