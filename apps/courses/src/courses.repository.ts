import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository, Course } from '@app/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CoursesRepository extends AbstractRepository<Course> {
	protected readonly logger: Logger = new Logger(CoursesRepository.name);

	constructor(
		@InjectRepository(Course) repo: Repository<Course>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Course not found');
	}
}
