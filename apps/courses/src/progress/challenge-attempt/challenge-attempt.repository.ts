import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, ChallengeAttempt } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ChallengeAttemptRepository extends AbstractRepository<ChallengeAttempt> {
	protected readonly logger: Logger = new Logger(
		ChallengeAttemptRepository.name,
	);

	constructor(
		@InjectRepository(ChallengeAttempt) repo: Repository<ChallengeAttempt>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'ChallengeAttempt not found');
	}
}
