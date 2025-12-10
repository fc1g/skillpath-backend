import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ChallengeAttemptRepository } from './challenge-attempt.repository';
import {
	ChallengeAttempt,
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
} from '@app/common';
import { UpdateChallengeAttemptInput } from './dto/update-challenge-attempt.input';
import { QueryFailedError } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { CreateChallengeAttemptInput } from './dto/create-challenge-attempt.input';
import { ChallengeAttemptsWithTotalObject } from './dto/challenge-attempts-with-total.object';

@Injectable()
export class ChallengeAttemptService {
	private readonly logger: Logger = new Logger(ChallengeAttemptService.name);

	constructor(
		private readonly challengeAttemptRepository: ChallengeAttemptRepository,
	) {}

	async create(
		createChallengeAttemptInput: CreateChallengeAttemptInput,
	): Promise<ChallengeAttempt> {
		const challengeAttempt = plainToClass(ChallengeAttempt, {
			status: createChallengeAttemptInput.status,
			submittedCode: createChallengeAttemptInput.submittedCode,
			attempts: createChallengeAttemptInput.attempts,
			testResults: createChallengeAttemptInput.testResults,
			courseProgress: {
				id: createChallengeAttemptInput.courseProgressId,
			},
			userId: createChallengeAttemptInput.userId,
			challengeId: createChallengeAttemptInput.challengeId,
			attemptedAt: createChallengeAttemptInput.attemptedAt,
		});

		try {
			return await this.challengeAttemptRepository.create(challengeAttempt);
		} catch (err) {
			this.logger.error('Failed to create challenge attempt', err);
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException(
					'Challenge attempt with this user and challenge already exists',
				);
			}

			throw new InternalServerErrorException(
				'Unable to create challenge attempt, please try again later',
			);
		}
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<ChallengeAttemptsWithTotalObject> {
		return this.challengeAttemptRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<ChallengeAttempt> {
		return this.challengeAttemptRepository.findOne({ id });
	}

	async update(
		id: string,
		updateChallengeAttemptInput: UpdateChallengeAttemptInput,
	): Promise<ChallengeAttempt> {
		return this.challengeAttemptRepository.update(
			{ id },
			updateChallengeAttemptInput,
		);
	}

	async remove(id: string): Promise<ChallengeAttempt> {
		return this.challengeAttemptRepository.remove({ id });
	}
}
