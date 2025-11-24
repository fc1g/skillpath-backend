import { Category, Course } from '@app/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CategoriesByCourseLoader } from '../data-loaders/categories-by-course.loader';

@Resolver(() => Course)
export class CourseCategoriesResolver {
	constructor(
		private readonly categoriesByCourseLoader: CategoriesByCourseLoader,
	) {}

	@ResolveField('categories', () => [Category])
	async getCategoriesOfCourse(@Parent() course: Course) {
		return this.categoriesByCourseLoader.load(course.id);
	}
}
