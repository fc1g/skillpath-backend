import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Lesson } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LessonsRepository extends AbstractRepository<Lesson> {
	protected readonly logger: Logger = new Logger(LessonsRepository.name);

	constructor(
		@InjectRepository(Lesson) repo: Repository<Lesson>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Lesson not found');
	}
}
