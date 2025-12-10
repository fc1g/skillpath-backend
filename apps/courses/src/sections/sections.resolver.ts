import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import { PaginationQueryInput, Section } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSectionInput } from './dto/create-section.input';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Sections')
@Resolver(() => Section)
export class SectionsResolver {
	constructor(private readonly sectionsService: SectionsService) {}

	@Mutation(() => Section, { name: 'createSection' })
	async create(
		@Args('createSectionInput') createSectionInput: CreateSectionInput,
	) {
		return this.sectionsService.create(createSectionInput);
	}

	@Query(() => [Section], { name: 'sections' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.sectionsService.find(paginationQueryInput);
	}

	@Query(() => Section, { name: 'section' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.sectionsService.findOne(id);
	}

	@Mutation(() => Section, { name: 'updateSection' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateSectionInput') updateSectionInput: CreateSectionInput,
	) {
		return this.sectionsService.update(id, updateSectionInput);
	}

	@Mutation(() => Section, { name: 'removeSection' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.sectionsService.remove(id);
	}
}
