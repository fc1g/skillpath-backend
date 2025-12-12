import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import {
	JwtAuthGuard,
	PaginationQueryInput,
	Roles,
	RoleType,
	Section,
} from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSectionInput } from './dto/create-section.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SectionsWithTotalObject } from './dto/sections-with-total.object';

@ApiTags('Sections')
@Resolver(() => Section)
export class SectionsResolver {
	constructor(private readonly sectionsService: SectionsService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Section, { name: 'createSection' })
	async create(
		@Args('createSectionInput') createSectionInput: CreateSectionInput,
	) {
		return this.sectionsService.create(createSectionInput);
	}

	@Query(() => SectionsWithTotalObject, { name: 'sections' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.sectionsService.find(paginationQueryInput);
	}

	@Query(() => Section, { name: 'section' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.sectionsService.findOne(id);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Section, { name: 'updateSection' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateSectionInput') updateSectionInput: CreateSectionInput,
	) {
		return this.sectionsService.update(id, updateSectionInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Section, { name: 'removeSection' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.sectionsService.remove(id);
	}
}
