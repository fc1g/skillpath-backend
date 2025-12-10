import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import {
	Category,
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import { plainToClass } from 'class-transformer';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class CategoriesService {
	private readonly logger: Logger = new Logger(CategoriesService.name);

	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
		const category = plainToClass(Category, {
			name: createCategoryInput.name,
		});

		try {
			return await this.categoriesRepository.create(category);
		} catch (err) {
			this.logger.error('Failed to create category', err);
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException('Category with this name already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create category, please try again later',
			);
		}
	}

	async find(paginationQueryInput: PaginationQueryInput): Promise<Category[]> {
		return this.categoriesRepository.find(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Category> {
		return this.categoriesRepository.findOne({ id });
	}

	async update(
		id: string,
		updateCategoryInput: UpdateCategoryInput,
	): Promise<Category> {
		return this.categoriesRepository.update({ id }, updateCategoryInput);
	}

	async remove(id: string): Promise<Category> {
		return this.categoriesRepository.remove({ id });
	}

	async preloadCategoryByName(
		createCategoryInput: CreateCategoryInput,
	): Promise<Category> {
		try {
			const existingCategory = await this.categoriesRepository.findOne({
				name: createCategoryInput.name,
			});
			if (existingCategory) {
				return existingCategory;
			}
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createCategoryInput);
	}
}
