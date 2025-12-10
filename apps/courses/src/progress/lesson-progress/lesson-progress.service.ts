import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { LessonProgressRepository } from './lesson-progress.repository';
import {
	CourseProgress,
	DEFAULT_TAKE,
	LessonProgress,
	LessonProgressStatus,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import { UpdateLessonProgressInput } from './dto/update-lesson-progress.input';
import { CreateLessonProgressInput } from './dto/create-lesson-progress.input';
import { DataSource, QueryFailedError } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { LessonProgressesWithTotalObject } from './dto/lesson-progresses-with-total.object';

@Injectable()
export class LessonProgressService {
	private readonly logger: Logger = new Logger(LessonProgressService.name);

	constructor(
		private readonly lessonProgressRepository: LessonProgressRepository,
		private readonly dataSource: DataSource,
	) {}

	async create(
		createLessonProgressInput: CreateLessonProgressInput,
	): Promise<LessonProgress> {
		const lessonProgress = plainToClass(LessonProgress, {
			status: createLessonProgressInput.status,
			courseProgress: {
				id: createLessonProgressInput.courseProgressId,
			},
			userId: createLessonProgressInput.userId,
			lessonId: createLessonProgressInput.lessonId,
			quizzesAttempts: [],
		});

		try {
			return await this.lessonProgressRepository.create(lessonProgress);
		} catch (err) {
			this.logger.error('Failed to create lesson progress', err);
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException(
					'Lesson progress with this user and lesson already exists',
				);
			}

			throw new InternalServerErrorException(
				'Unable to create lesson progress, please try again later',
			);
		}
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<LessonProgressesWithTotalObject> {
		return this.lessonProgressRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(userId: string, lessonId: string): Promise<LessonProgress> {
		return this.lessonProgressRepository.findOne({ userId, lessonId });
	}

	async update(
		updateLessonProgressInput: UpdateLessonProgressInput,
	): Promise<LessonProgress> {
		const existingLessonProgress = await this.findOne(
			updateLessonProgressInput.userId ?? '',
			updateLessonProgressInput.lessonId ?? '',
		);

		return this.dataSource.transaction(async manager => {
			const courseProgressRepo = manager.getRepository(CourseProgress);
			const courseProgress = await courseProgressRepo.findOne({
				where: {
					userId: updateLessonProgressInput.userId,
					courseId: updateLessonProgressInput.courseId,
				},
			});

			if (!courseProgress) {
				throw new BadRequestException(
					'Course progress not found for this user',
				);
			}

			if (
				updateLessonProgressInput.status === LessonProgressStatus.COMPLETED &&
				existingLessonProgress.status === LessonProgressStatus.NOT_STARTED
			) {
				await courseProgressRepo.increment(
					{ id: courseProgress.id },
					'completedLessonsCount',
					1,
				);
			}

			if (
				updateLessonProgressInput.status === LessonProgressStatus.NOT_STARTED &&
				existingLessonProgress.status === LessonProgressStatus.COMPLETED
			) {
				await courseProgressRepo.decrement(
					{ id: courseProgress.id },
					'completedLessonsCount',
					1,
				);
			}

			return await this.lessonProgressRepository.update(
				{ id: existingLessonProgress.id },
				{
					status: updateLessonProgressInput.status,
				},
			);
		});
	}

	async remove(id: string): Promise<LessonProgress> {
		return this.lessonProgressRepository.remove({ id });
	}

	async preloadLessonProgress(
		createLessonProgressInput: CreateLessonProgressInput,
	): Promise<LessonProgress> {
		try {
			const existingLessonProgress =
				await this.lessonProgressRepository.findOne({
					userId: createLessonProgressInput.userId,
					lessonId: createLessonProgressInput.lessonId,
				});
			if (existingLessonProgress) {
				return existingLessonProgress;
			}
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createLessonProgressInput);
	}
}
