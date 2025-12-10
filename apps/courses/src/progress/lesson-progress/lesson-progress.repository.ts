import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, LessonProgress } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LessonProgressRepository extends AbstractRepository<LessonProgress> {
	protected readonly logger: Logger = new Logger(LessonProgressRepository.name);

	constructor(
		@InjectRepository(LessonProgress) repo: Repository<LessonProgress>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'LessonProgress not found');
	}
}
