import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, UserRating } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRatingsRepository extends AbstractRepository<UserRating> {
	protected readonly logger: Logger = new Logger(UserRatingsRepository.name);

	constructor(
		@InjectRepository(UserRating) repo: Repository<UserRating>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'User Rating not found');
	}
}
