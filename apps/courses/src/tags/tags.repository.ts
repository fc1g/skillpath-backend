import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Tag } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TagsRepository extends AbstractRepository<Tag> {
	protected readonly logger: Logger = new Logger(TagsRepository.name);

	constructor(
		@InjectRepository(Tag) repo: Repository<Tag>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Tag not found');
	}
}
