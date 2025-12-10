import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import {
	Challenge,
	Course,
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { UpdateChallengeInput } from './dto/update-challenge.input';
import { ChallengesRepository } from './challenges.repository';
import { plainToClass } from 'class-transformer';
import { DataSource, QueryFailedError } from 'typeorm';
import { ChallengesWithTotalObject } from './dto/challenges-with-total.object';

@Injectable()
export class ChallengesService {
	private readonly logger: Logger = new Logger(ChallengesService.name);

	constructor(
		private readonly challengesRepository: ChallengesRepository,
		private readonly dataSource: DataSource,
	) {}

	async create(createChallengeInput: CreateChallengeInput): Promise<Challenge> {
		if (!createChallengeInput.courseId) {
			throw new BadRequestException('Course ID was not provided');
		}

		if (!createChallengeInput.sectionId) {
			throw new BadRequestException('Section ID was not provided');
		}

		return this.dataSource.transaction(async manager => {
			const courseRepo = manager.getRepository(Course);

			const challenge = plainToClass(Challenge, {
				path: createChallengeInput.path,
				title: createChallengeInput.title,
				instructions: createChallengeInput.instructions,
				requirements: createChallengeInput.requirements,
				example: createChallengeInput.example,
				templateCode: createChallengeInput.templateCode,
				difficulty: createChallengeInput.difficulty,
				language: createChallengeInput.language,
				order: createChallengeInput.order,
				expectedOutput: createChallengeInput.expectedOutput,
				expectedStructure: createChallengeInput.expectedStructure,
				section: {
					id: createChallengeInput.sectionId,
				},
				courseId: createChallengeInput.courseId,
			});

			try {
				const newChallenge = await this.challengesRepository.create(challenge);
				await courseRepo.increment(
					{ id: createChallengeInput.courseId },
					'challengesCount',
					1,
				);
				return this.challengesRepository.create(newChallenge);
			} catch (err) {
				this.logger.error('Failed to create challenge', err);
				if (
					err instanceof QueryFailedError &&
					(err.driverError as { code: string }).code ===
						POSTGRES_UNIQUE_VIOLATION
				) {
					throw new ConflictException(
						'Challenge with this order for provided section already exists',
					);
				}

				throw new InternalServerErrorException(
					'Unable to create challenge, please try again later',
				);
			}
		});
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<ChallengesWithTotalObject> {
		return this.challengesRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Challenge> {
		return this.challengesRepository.findOne({ id });
	}

	async update(
		id: string,
		updateChallengeInput: UpdateChallengeInput,
	): Promise<Challenge> {
		return this.challengesRepository.update({ id }, updateChallengeInput);
	}

	async remove(id: string): Promise<Challenge> {
		return this.challengesRepository.remove({ id });
	}

	async preloadChallenge(
		createChallengeInput: CreateChallengeInput,
	): Promise<Challenge> {
		try {
			const existingChallenge = await this.challengesRepository.findOne({
				section: {
					id: createChallengeInput.sectionId,
				},
				order: createChallengeInput.order,
			});
			if (existingChallenge) {
				return existingChallenge;
			}
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createChallengeInput);
	}
}
