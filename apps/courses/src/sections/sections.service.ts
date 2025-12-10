import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { SectionsRepository } from './sections.repository';
import {
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
	Section,
} from '@app/common';
import { UpdateSectionInput } from './dto/update-section.input';
import { CreateSectionInput } from './dto/create-section.input';
import { plainToClass } from 'class-transformer';
import { QueryFailedError } from 'typeorm';
import { LessonsService } from '../lessons/lessons.service';
import { ChallengesService } from '../challenges/challenges.service';
import { SectionsWithTotalObject } from './dto/sections-with-total.object';

@Injectable()
export class SectionsService {
	private readonly logger: Logger = new Logger(SectionsService.name);

	constructor(
		private readonly sectionsRepository: SectionsRepository,
		private readonly lessonsService: LessonsService,
		private readonly challengesService: ChallengesService,
	) {}

	async create(createSectionInput: CreateSectionInput): Promise<Section> {
		const section = plainToClass(Section, {
			title: createSectionInput.title,
			order: createSectionInput.order,
			course: {
				id: createSectionInput.courseId,
			},
			lessons: [],
			challenges: [],
		});

		try {
			const newSection = await this.sectionsRepository.create(section);
			newSection.lessons = await Promise.all(
				createSectionInput.lessons.map(createLessonInput =>
					this.lessonsService.preloadLesson({
						...createLessonInput,
						sectionId: newSection.id,
						courseId: createSectionInput.courseId,
					}),
				),
			);
			newSection.challenges = await Promise.all(
				createSectionInput.challenges.map(createChallengeInput =>
					this.challengesService.preloadChallenge({
						...createChallengeInput,
						sectionId: newSection.id,
						courseId: createSectionInput.courseId,
					}),
				),
			);

			return this.sectionsRepository.create(newSection);
		} catch (err) {
			this.logger.error('Failed to create section', err);
			if (
				err instanceof QueryFailedError &&
				(err.driverError as { code: string }).code === POSTGRES_UNIQUE_VIOLATION
			) {
				throw new ConflictException('Section with this title already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create section, please try again later',
			);
		}
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<SectionsWithTotalObject> {
		return this.sectionsRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Section> {
		return this.sectionsRepository.findOne({ id });
	}

	async update(
		id: string,
		updateSectionInput: UpdateSectionInput,
	): Promise<Section> {
		return this.sectionsRepository.update({ id }, updateSectionInput);
	}

	async remove(id: string): Promise<Section> {
		return this.sectionsRepository.remove({ id });
	}

	async preloadSection(
		createSectionInput: CreateSectionInput,
	): Promise<Section> {
		try {
			const existingSection = await this.sectionsRepository.findOne({
				title: createSectionInput.title,
				course: { id: createSectionInput.courseId },
				order: createSectionInput.order,
			});
			if (existingSection) {
				return existingSection;
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createSectionInput);
	}
}
