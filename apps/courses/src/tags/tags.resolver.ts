import {
	JwtAuthGuard,
	PaginationQueryInput,
	Roles,
	RoleType,
	Tag,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { TagsService } from './tags.service';
import { TagsWithTotalObject } from './dto/tags-with-total.object';

@ApiTags('Tags')
@Resolver(() => Tag)
export class TagsResolver {
	constructor(private readonly tagsService: TagsService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Tag, { name: 'createTag' })
	async create(@Args('createTagInput') createTagInput: CreateTagInput) {
		return this.tagsService.create(createTagInput);
	}

	@Query(() => TagsWithTotalObject, { name: 'tags' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.tagsService.find(paginationQueryInput);
	}

	@Query(() => Tag, { name: 'tag' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.tagsService.findOne(id);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Tag, { name: 'updateTag' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateTagInput') updateTagInput: UpdateTagInput,
	) {
		return this.tagsService.update(id, updateTagInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Tag, { name: 'removeTag' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.tagsService.remove(id);
	}
}
