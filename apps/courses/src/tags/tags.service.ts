import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import {
	CreateTagInput,
	DEFAULT_TAKE,
	PaginationQueryInput,
	POSTGRES_UNIQUE_VIOLATION,
	Tag,
	UpdateTagInput,
} from '@app/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TagsService {
	private readonly logger: Logger = new Logger(TagsService.name);

	constructor(private readonly tagsRepository: TagsRepository) {}

	async create(createTagInput: CreateTagInput): Promise<Tag> {
		const tag = plainToClass(Tag, {
			name: createTagInput.name,
		});

		try {
			return await this.tagsRepository.create(tag);
		} catch (err) {
			this.logger.error('Failed to create tag', err);
			if ((err as { code?: string }).code === POSTGRES_UNIQUE_VIOLATION) {
				throw new ConflictException('Tag with this name already exists');
			}

			throw new InternalServerErrorException(
				'Unable to create tag, please try again later',
			);
		}
	}

	async find(paginationQueryInput: PaginationQueryInput): Promise<Tag[]> {
		return this.tagsRepository.find(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<Tag> {
		return this.tagsRepository.findOne({ id });
	}

	async update(id: string, updateTagInput: UpdateTagInput): Promise<Tag> {
		return this.tagsRepository.update({ id }, updateTagInput);
	}

	async remove(id: string): Promise<Tag> {
		return this.tagsRepository.remove({ id });
	}

	async preloadTagByName(createTagInput: CreateTagInput): Promise<Tag> {
		try {
			const existingTag = await this.tagsRepository.findOne({
				name: createTagInput.name,
			});
			if (existingTag) {
				return existingTag;
			}
		} catch (err) {
			if (err instanceof NotFoundException) {
				this.logger.warn(err.message);
			}
		}

		return this.create(createTagInput);
	}
}
