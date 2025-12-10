import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { QuizzesRepository } from './quizzes.repository';
import {
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
	Quiz,
} from '@app/common';
import { UpdateLessonInput } from '../lessons/dto/update-lesson.input';
import { CreateQuizInput } from './dto/create-quiz.input';
import { plainToClass } from 'class-transformer';
import { QueryFailedError } from 'typeorm';
import { QuizzesWithTotalObject } from './dto/quizzes-with-total.object';

@Injectable()
export class QuizzesService {
	private readonly logger: Logger = new Logger(QuizzesService.name);

	constructor(private readonly quizzesRepository: QuizzesRepository) {}

	async create(createQuizInput: CreateQuizInput): Promise<Quiz> {
		const quiz = plainToClass(Quiz, {
			question: createQuizInput.question,
			type: createQuizInput.type,
			options: createQuizInput.options,
			correctOptionIndex: createQuizInput.correctOptionIndex,
			explanation: createQuizInput.explanation,
			order: createQuizInput.order,
			lesson: {
				id: createQuizInput.lessonId,
			},
		});

		try {
			return await this.quizzesRepository.create(quiz);
		} catch (err) {
			this.logger.error('Failed to create quiz', err);
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException(
					'Quiz with this order for provided lesson already exists',
				);
			}

			throw new InternalServerErrorException(
				'Unable to create quiz, please try again later',
			);
		}
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<QuizzesWithTotalObject> {
		return this.quizzesRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset || 0,
				take: paginationQueryInput.limit || DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Quiz> {
		return this.quizzesRepository.findOne({ id });
	}

	async update(id: string, updateQuizInput: UpdateLessonInput): Promise<Quiz> {
		return this.quizzesRepository.update({ id }, updateQuizInput);
	}

	async remove(id: string): Promise<Quiz> {
		return this.quizzesRepository.remove({ id });
	}

	async preloadQuiz(createQuizInput: CreateQuizInput): Promise<Quiz> {
		try {
			const existingQuiz = await this.quizzesRepository.findOne({
				lesson: {
					id: createQuizInput.lessonId,
				},
				order: createQuizInput.order,
			});
			if (existingQuiz) {
				return existingQuiz;
			}
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createQuizInput);
	}
}
