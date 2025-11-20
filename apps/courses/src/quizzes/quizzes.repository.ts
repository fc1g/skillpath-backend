import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Quiz } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class QuizzesRepository extends AbstractRepository<Quiz> {
	protected readonly logger: Logger = new Logger(QuizzesRepository.name);

	constructor(
		@InjectRepository(Quiz) repo: Repository<Quiz>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Quiz not found');
	}
}
