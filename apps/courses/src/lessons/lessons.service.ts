import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { LessonsRepository } from './lessons.repository';
import {
	Course,
	DEFAULT_TAKE,
	Lesson,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { plainToClass } from 'class-transformer';
import { CreateLessonInput } from './dto/create-lesson.input';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import { QuizzesService } from '../quizzes/quizzes.service';
import { LessonsWithTotalObject } from './dto/lessons-with-total.object';

@Injectable()
export class LessonsService {
	private readonly logger: Logger = new Logger(LessonsService.name);

	constructor(
		private readonly lessonsRepository: LessonsRepository,
		private readonly quizzesService: QuizzesService,
		private readonly dataSource: DataSource,
	) {}

	async create(
		createLessonInput: CreateLessonInput,
		providedManager?: EntityManager,
	): Promise<Lesson> {
		if (!createLessonInput.courseId) {
			throw new BadRequestException('Course ID was not provided');
		}

		if (!createLessonInput.sectionId) {
			throw new BadRequestException('Section ID was not provided');
		}

		const executeCreate = async (manager: EntityManager) => {
			const courseRepo = manager.getRepository(Course);
			const lessonRepo = manager.getRepository(Lesson);

			const lesson = plainToClass(Lesson, {
				title: createLessonInput.title,
				order: createLessonInput.order,
				content: createLessonInput.content,
				durationSeconds: createLessonInput.durationSeconds,
				section: {
					id: createLessonInput.sectionId,
				},
				quizzes: [],
				courseId: createLessonInput.courseId,
			});

			try {
				const newLesson = await lessonRepo.save(lesson);
				newLesson.quizzes = await Promise.all(
					createLessonInput.quizzes.map(createQuizInput =>
						this.quizzesService.preloadQuiz(
							{
								...createQuizInput,
								lessonId: newLesson.id,
							},
							manager,
						),
					),
				);
				await courseRepo.increment(
					{ id: createLessonInput.courseId },
					'durationSeconds',
					createLessonInput.durationSeconds,
				);
				await courseRepo.increment(
					{ id: createLessonInput.courseId },
					'lessonsCount',
					1,
				);
				return await lessonRepo.save(newLesson);
			} catch (err) {
				this.logger.error('Failed to create lesson', err);
				if (
					err instanceof QueryFailedError &&
					(err.driverError as { code: string }).code ===
						POSTGRES_UNIQUE_VIOLATION
				) {
					throw new ConflictException('Lesson with this title already exists');
				}

				throw new InternalServerErrorException(
					'Unable to create section, please try again later',
				);
			}
		};

		if (providedManager) {
			return executeCreate(providedManager);
		}

		return this.dataSource.transaction(executeCreate);
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<LessonsWithTotalObject> {
		return this.lessonsRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Lesson> {
		return this.lessonsRepository.findOne({ id });
	}

	async update(
		id: string,
		updateLessonInput: UpdateLessonInput,
	): Promise<Lesson> {
		return this.lessonsRepository.update({ id }, updateLessonInput);
	}

	async remove(id: string): Promise<Lesson> {
		return this.lessonsRepository.remove({ id });
	}

	async preloadLesson(
		createLessonInput: CreateLessonInput,
		manager?: EntityManager,
	): Promise<Lesson> {
		try {
			const existingLesson = await this.lessonsRepository.findOne({
				title: createLessonInput.title,
				section: { id: createLessonInput.sectionId },
				order: createLessonInput.order,
			});
			if (existingLesson) {
				return existingLesson;
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createLessonInput, manager);
	}
}
