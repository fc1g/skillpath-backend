import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Role } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RolesRepository extends AbstractRepository<Role> {
	protected readonly logger: Logger = new Logger(RolesRepository.name);

	constructor(
		@InjectRepository(Role) repo: Repository<Role>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'Role not found');
	}
}
