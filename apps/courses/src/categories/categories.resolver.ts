import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import {
	Category,
	CreateCategoryInput,
	PaginationQueryInput,
	UpdateCategoryInput,
} from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Categories')
@Resolver(() => Category)
export class CategoriesResolver {
	constructor(private readonly categoriesService: CategoriesService) {}

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

	@Mutation(() => Category, { name: 'updateCategory' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
	) {
		return this.categoriesService.update(id, updateCategoryInput);
	}

	@Mutation(() => Category, { name: 'removeCategory' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.categoriesService.remove(id);
	}
}
