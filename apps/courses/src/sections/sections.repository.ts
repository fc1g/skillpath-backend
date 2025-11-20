import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Section } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SectionsRepository extends AbstractRepository<Section> {
	protected readonly logger: Logger = new Logger(SectionsRepository.name);

	constructor(
		@InjectRepository(Section) repo: Repository<Section>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Section not found');
	}
}
