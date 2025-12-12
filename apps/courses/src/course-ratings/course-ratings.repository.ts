import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, CourseRating } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CourseRatingsRepository extends AbstractRepository<CourseRating> {
	protected readonly logger: Logger = new Logger(CourseRatingsRepository.name);

	constructor(
		@InjectRepository(CourseRating) repo: Repository<CourseRating>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Course Rating not found');
	}
}
