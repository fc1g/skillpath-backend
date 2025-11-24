import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from '@app/common/database/abstract.entity';
import {
	DeepPartial,
	EntityManager,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class AbstractRepository<T extends AbstractEntity<T>> {
	protected abstract readonly logger: Logger;

	protected constructor(
		private readonly repo: Repository<T>,
		private readonly entityManager: EntityManager,
		private readonly notFoundMessage: string,
	) {}

	async create(entity: T): Promise<T> {
		return this.entityManager.save(entity);
	}

	async find(
		where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
		options?: FindManyOptions<T>,
	): Promise<T[]> {
		return this.repo.find({ where, ...options });
	}

	async findOne(
		where: FindOptionsWhere<T>,
		options?: FindOneOptions<T>,
	): Promise<T> {
		const entity = await this.repo.findOne({ where, ...options });

		if (!entity) {
			this.logger.warn('Entity not found with where', where);
			throw new NotFoundException(this.notFoundMessage ?? 'Entity not found');
		}

		return entity;
	}

	async update(
		where: FindOptionsWhere<T>,
		partialEntity: QueryDeepPartialEntity<T>,
	): Promise<T> {
		const entity = await this.repo.preload({
			...where,
			...partialEntity,
		} as unknown as DeepPartial<T>);

		if (!entity) {
			this.logger.warn('Entity not found with where', where);
			throw new NotFoundException(this.notFoundMessage);
		}

		return this.entityManager.save(entity);
	}

	async remove(where: FindOptionsWhere<T>): Promise<T> {
		const entity = await this.findOne(where);
		return this.repo.remove(entity);
	}
}
