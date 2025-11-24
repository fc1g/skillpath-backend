import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import {
	CreateTagInput,
	PaginationQueryInput,
	Tag,
	UpdateTagInput,
} from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Tags')
@Resolver(() => Tag)
export class TagsResolver {
	constructor(private readonly tagsService: TagsService) {}

	@Mutation(() => Tag, { name: 'createTag' })
	async create(@Args('createTagInput') createTagInput: CreateTagInput) {
		return this.tagsService.create(createTagInput);
	}

	@Query(() => [Tag], { name: 'tags' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.tagsService.find(paginationQueryInput);
	}

	@Query(() => Tag, { name: 'tag' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.tagsService.findOne(id);
	}

	@Mutation(() => Tag, { name: 'updateTag' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateTagInput') updateTagInput: UpdateTagInput,
	) {
		return this.tagsService.update(id, updateTagInput);
	}

	@Mutation(() => Tag, { name: 'removeTag' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.tagsService.remove(id);
	}
}
