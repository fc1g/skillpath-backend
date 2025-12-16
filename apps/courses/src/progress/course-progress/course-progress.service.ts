import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CourseProgressRepository } from './course-progress.repository';
import {
	Course,
	CourseProgress,
	CourseProgressStatus,
	DEFAULT_TAKE,
	Lesson,
	LessonProgressStatus,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import { UpdateCourseProgressInput } from './dto/update-course-progress.input';
import { DataSource, FindOptionsWhere, QueryFailedError } from 'typeorm';
import { CreateCourseProgressInput } from './dto/create-course-progress.input';
import { plainToClass } from 'class-transformer';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import { CourseProgressesWithTotalObject } from './dto/course-progresses-with-total.object';

@Injectable()
export class CourseProgressService {
	private readonly logger: Logger = new Logger(CourseProgressService.name);

	constructor(
		private readonly courseProgressRepository: CourseProgressRepository,
		private readonly lessonProgressService: LessonProgressService,
		private readonly dataSource: DataSource,
	) {}

	async create(
		createCourseProgressInput: CreateCourseProgressInput,
	): Promise<CourseProgress> {
		if (!createCourseProgressInput.userId) {
			throw new ConflictException('User ID was not provided');
		}

		const courseProgress = plainToClass(CourseProgress, {
			status: createCourseProgressInput.status,
			userId: createCourseProgressInput.userId,
			courseId: createCourseProgressInput.courseId,
			course: {
				id: createCourseProgressInput.courseId,
			},
			lastAccessedAt: createCourseProgressInput.lastAccessedAt,
			lessonsProgresses: [],
			challengesProgress: [],
		});

		return this.dataSource.transaction(async manager => {
			const lessonRepo = manager.getRepository(Lesson);
			const courseRepo = manager.getRepository(Course);
			const courseProgressRepo = manager.getRepository(CourseProgress);
			const lessons = await lessonRepo.find({
				where: {
					courseId: createCourseProgressInput.courseId,
				},
			});

			await courseRepo.increment(
				{ id: createCourseProgressInput.courseId },
				'studentsCount',
				1,
			);

			try {
				const newCourseProgress = await courseProgressRepo.save(courseProgress);

				newCourseProgress.lessonsProgresses = await Promise.all(
					lessons.map(lesson =>
						this.lessonProgressService.preloadLessonProgress(
							{
								status: LessonProgressStatus.NOT_STARTED,
								courseProgressId: newCourseProgress.id,
								userId: newCourseProgress.userId,
								lessonId: lesson.id,
							},
							manager,
						),
					),
				);

				return await courseProgressRepo.save(newCourseProgress);
			} catch (err) {
				this.logger.error('Failed to create course progress', err);
				if (
					err instanceof QueryFailedError &&
					(err.driverError as { code: string }).code ===
						POSTGRES_UNIQUE_VIOLATION
				) {
					throw new ConflictException(
						'Course progress with this user and course already exists',
					);
				}

				throw new InternalServerErrorException(
					'Unable to create course progress, please try again later',
				);
			}
		});
	}

	async find(
		userId: string,
		paginationQueryInput: PaginationQueryInput,
	): Promise<CourseProgressesWithTotalObject> {
		return this.courseProgressRepository.findWithTotal(
			{
				userId,
			},
			{
				order: { lastAccessedAt: 'DESC' },
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findCompletedCourses(
		userId: string,
		paginationQueryInput: PaginationQueryInput,
	): Promise<CourseProgressesWithTotalObject> {
		return this.courseProgressRepository.findWithTotal(
			{
				userId,
				status: CourseProgressStatus.COMPLETED,
			},
			{
				order: { lastAccessedAt: 'DESC' },
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<CourseProgress> {
		return this.courseProgressRepository.findOne({ id });
	}

	async findOneBy(
		where: FindOptionsWhere<CourseProgress>,
	): Promise<CourseProgress> {
		return this.courseProgressRepository.findOne(where);
	}

	async findLastVisitedCourse(userId: string): Promise<CourseProgress> {
		return this.courseProgressRepository.findOne(
			{
				userId,
			},
			{
				order: { lastAccessedAt: 'DESC' },
			},
		);
	}

	async update(
		userId: string,
		updateCourseProgressInput: UpdateCourseProgressInput,
	): Promise<CourseProgress> {
		const courseProgress = await this.findOneBy({
			userId,
			course: {
				id: updateCourseProgressInput.courseId,
			},
		});
		return this.courseProgressRepository.update(
			{ id: courseProgress.id },
			updateCourseProgressInput,
		);
	}

	async remove(id: string): Promise<CourseProgress> {
		return this.courseProgressRepository.remove({ id });
	}

	async preloadCourseProgress(
		createCourseProgressInput: CreateCourseProgressInput,
	): Promise<CourseProgress> {
		try {
			const existingCourseProgress =
				await this.courseProgressRepository.findOne({
					userId: createCourseProgressInput.userId,
					course: {
						id: createCourseProgressInput.courseId,
					},
				});
			if (existingCourseProgress) {
				return existingCourseProgress;
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createCourseProgressInput);
	}
}
