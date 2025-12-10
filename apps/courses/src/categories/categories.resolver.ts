import {
	Category,
	JwtAuthGuard,
	PaginationQueryInput,
	Roles,
	RoleType,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@ApiTags('Categories')
@Resolver(() => Category)
export class CategoriesResolver {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Category, { name: 'createCategory' })
	async create(
		@Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
	) {
		return this.categoriesService.create(createCategoryInput);
	}

	@Query(() => [Category], { name: 'categories' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.categoriesService.find(paginationQueryInput);
	}

	@Query(() => Category, { name: 'category' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.categoriesService.findOne(id);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Category, { name: 'updateCategory' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
	) {
		return this.categoriesService.update(id, updateCategoryInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Category, { name: 'removeCategory' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.categoriesService.remove(id);
	}
}
