import {
	Course,
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, QueryFailedError } from 'typeorm';
import { CategoriesService } from './categories/categories.service';
import { CoursesRepository } from './courses.repository';
import { CoursesPaginationQueryInput } from './dto/courses-pagination-query.input';
import { CoursesWithTotalObject } from './dto/courses-with-total.object';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { TagsService } from './tags/tags.service';
import { SectionsService } from './sections/sections.service';

@Injectable()
export class CoursesService {
	private readonly logger: Logger = new Logger(CoursesService.name);

	constructor(
		private readonly coursesRepository: CoursesRepository,
		private readonly tagsService: TagsService,
		private readonly categoriesService: CategoriesService,
		private readonly sectionsService: SectionsService,
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
			const newCourse = await this.coursesRepository.create(course);

			const sections = await Promise.all(
				createCourseInput.sections.map(createSectionInput =>
					this.sectionsService.preloadSection({
						...createSectionInput,
						courseId: newCourse.id,
					}),
				),
			);

			return this.update(newCourse.id, { sections });
		} catch (err) {
			this.logger.error('Failed to create course', err);
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException('Course with this title already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create course, please try again later',
			);
		}
	}

	async find(
		coursesPaginationQueryInput: CoursesPaginationQueryInput,
	): Promise<CoursesWithTotalObject> {
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

		return this.coursesRepository.findWithTotal(where, {
			order: {
				createdAt: 'DESC',
			},
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
