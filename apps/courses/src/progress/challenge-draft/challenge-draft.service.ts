import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ChallengeDraftRepository } from './challenge-draft.repository';
import { CreateChallengeDraftInput } from './dto/create-challenge-draft.input';
import { ChallengeDraft, POSTGRES_UNIQUE_VIOLATION } from '@app/common';
import { plainToClass } from 'class-transformer';
import { QueryFailedError } from 'typeorm';
import { UpdateChallengeDraftInput } from './dto/update-challenge-draft.input';

@Injectable()
export class ChallengeDraftService {
	protected readonly logger: Logger = new Logger(ChallengeDraftService.name);

	constructor(
		private readonly challengeDraftRepository: ChallengeDraftRepository,
	) {}

	async create(
		createChallengeDraftInput: CreateChallengeDraftInput,
	): Promise<ChallengeDraft> {
		const challengeDraft = plainToClass(ChallengeDraft, {
			userId: createChallengeDraftInput.userId,
			challengeId: createChallengeDraftInput.challengeId,
			code: createChallengeDraftInput.code,
		});

		try {
			return await this.challengeDraftRepository.create(challengeDraft);
		} catch (err) {
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException('Challenge draft already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create challenge draft, please try again later',
			);
		}
	}

	async findOne(userId: string, challengeId: string): Promise<ChallengeDraft> {
		return this.challengeDraftRepository.findOne({ userId, challengeId });
	}

	async update(
		updateChallengeDraft: UpdateChallengeDraftInput,
	): Promise<ChallengeDraft> {
		if (!updateChallengeDraft.userId || !updateChallengeDraft.challengeId) {
			throw new ConflictException('User id and Challenge id are required');
		}

		try {
			const existingDraft = await this.findOne(
				updateChallengeDraft.userId,
				updateChallengeDraft.challengeId,
			);
			if (
				existingDraft &&
				updateChallengeDraft.code !== existingDraft.code &&
				updateChallengeDraft.code
			) {
				return await this.challengeDraftRepository.update(
					{ id: existingDraft.id },
					{
						code: updateChallengeDraft.code,
					},
				);
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}

		return this.create({
			userId: updateChallengeDraft.userId,
			challengeId: updateChallengeDraft.challengeId,
			code: updateChallengeDraft.code ?? '',
		});
	}
}
