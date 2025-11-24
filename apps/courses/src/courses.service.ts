import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import {
	Course,
	CoursesPaginationQueryInput,
	CreateCourseInput,
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
	UpdateCourseInput,
} from '@app/common';
import { TagsService } from './tags/tags.service';
import { plainToClass } from 'class-transformer';
import { CategoriesService } from './categories/categories.service';
import { ILike } from 'typeorm';

@Injectable()
export class CoursesService {
	private readonly logger: Logger = new Logger(CoursesService.name);

	constructor(
		private readonly coursesRepository: CoursesRepository,
		private readonly tagsService: TagsService,
		private readonly categoriesService: CategoriesService,
	) {}

	async create(createCourseInput: CreateCourseInput): Promise<Course> {
		const tags = await Promise.all(
			createCourseInput.tags?.map(createTagInput =>
				this.tagsService.preloadTagByName(createTagInput),
			),
		);
		const categories = await Promise.all(
			createCourseInput.categories?.map(createCourseInput =>
				this.categoriesService.preloadCategoryByName(createCourseInput),
			),
		);

		const course = plainToClass(Course, {
			...createCourseInput,
			tags,
			categories,
			sections: [],
		});

		try {
			return await this.coursesRepository.create(course);
		} catch (err) {
			this.logger.error('Failed to create course', err);
			if ((err as { code: string }).code === POSTGRES_UNIQUE_VIOLATION) {
				throw new Error('Course with this title already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create course, please try again later',
			);
		}
	}

	async find(
		coursesPaginationQueryInput: CoursesPaginationQueryInput,
	): Promise<Course[]> {
		const { level, category, search, offset, limit } =
			coursesPaginationQueryInput;

		const baseWhere = {
			...(level && { level }),
			...(category && { categories: { name: category } }),
		};

		const where = search
			? [
					{ ...baseWhere, title: ILike(`%${search}%`) },
					{ ...baseWhere, subtitle: ILike(`%${search}%`) },
				]
			: baseWhere;

		return this.coursesRepository.find(where, {
			skip: offset ?? 0,
			take: limit ?? DEFAULT_TAKE,
		});
	}

	async findPopularCourses(
		paginationQueryInput: PaginationQueryInput,
	): Promise<Course[]> {
		return this.coursesRepository.find(
			{},
			{
				order: {
					averageRating: 'DESC',
				},
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Course> {
		return this.coursesRepository.findOne({ id });
	}

	async update(
		id: string,
		updateCourseInput: UpdateCourseInput,
	): Promise<Course> {
		return this.coursesRepository.update({ id }, updateCourseInput);
	}

	async remove(id: string): Promise<Course> {
		return this.coursesRepository.remove({ id });
	}
}
