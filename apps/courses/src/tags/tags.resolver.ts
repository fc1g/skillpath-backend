import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { CreateTagInput, Tag, UpdateTagInput } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Tags')
@Resolver(() => Tag)
export class TagsResolver {
	constructor(private readonly tagsService: TagsService) {}

	@Mutation(() => Tag, { name: 'createTag' })
	create(@Args('createTagInput') createTagInput: CreateTagInput) {
		return this.tagsService.create(createTagInput);
	}

	@Query(() => [Tag], { name: 'tags' })
	findAll() {
		return this.tagsService.find();
	}

	@Query(() => Tag, { name: 'tag' })
	findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.tagsService.findOne(id);
	}

	@Mutation(() => Tag)
	updateTag(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateTagInput') updateTagInput: UpdateTagInput,
	) {
		return this.tagsService.update(id, updateTagInput);
	}

	@Mutation(() => Tag)
	removeTag(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.tagsService.remove(id);
	}
}
