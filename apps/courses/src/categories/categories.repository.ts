import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Category } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
	protected readonly logger: Logger = new Logger(CategoriesRepository.name);

	constructor(
		@InjectRepository(Category) repo: Repository<Category>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Category not found');
	}
}
