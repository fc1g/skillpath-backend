import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, CourseProgress } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CourseProgressRepository extends AbstractRepository<CourseProgress> {
	protected readonly logger: Logger = new Logger(CourseProgressRepository.name);

	constructor(
		@InjectRepository(CourseProgress) repo: Repository<CourseProgress>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'CourseProgress not found');
	}
}
