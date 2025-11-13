import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, OAuthAccount } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OAuthAccountsRepository extends AbstractRepository<OAuthAccount> {
	protected readonly logger: Logger = new Logger(OAuthAccountsRepository.name);

	constructor(
		@InjectRepository(OAuthAccount) repo: Repository<OAuthAccount>,
		entityManager: EntityManager,
	) {
		super(repo, entityManager, 'OAuth account not found');
	}
}
