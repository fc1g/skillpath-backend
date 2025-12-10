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
import { DataSource, QueryFailedError } from 'typeorm';
import { QuizzesService } from '../quizzes/quizzes.service';

@Injectable()
export class LessonsService {
	private readonly logger: Logger = new Logger(LessonsService.name);

	constructor(
		private readonly lessonsRepository: LessonsRepository,
		private readonly quizzesService: QuizzesService,
		private readonly dataSource: DataSource,
	) {}

	async create(createLessonInput: CreateLessonInput): Promise<Lesson> {
		if (!createLessonInput.courseId) {
			throw new BadRequestException('Course ID was not provided');
		}

		if (!createLessonInput.sectionId) {
			throw new BadRequestException('Section ID was not provided');
		}

		return this.dataSource.transaction(async manager => {
			const courseRepo = manager.getRepository(Course);

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
				const newLesson = await this.lessonsRepository.create(lesson);
				newLesson.quizzes = await Promise.all(
					createLessonInput.quizzes.map(createQuizInput =>
						this.quizzesService.preloadQuiz({
							...createQuizInput,
							lessonId: newLesson.id,
						}),
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
				return this.lessonsRepository.create(newLesson);
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
		});
	}

	async find(paginationQueryInput: PaginationQueryInput): Promise<Lesson[]> {
		return this.lessonsRepository.find(
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

	async preloadLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
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

		return this.create(createLessonInput);
	}
}
