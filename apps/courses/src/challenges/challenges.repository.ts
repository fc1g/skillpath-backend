import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Challenge } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ChallengesRepository extends AbstractRepository<Challenge> {
	protected readonly logger: Logger = new Logger(ChallengesRepository.name);

	constructor(
		@InjectRepository(Challenge) repo: Repository<Challenge>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Challenge not found');
	}
}
