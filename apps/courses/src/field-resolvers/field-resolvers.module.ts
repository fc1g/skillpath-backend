import { Module } from '@nestjs/common';
import { CourseTagsResolver } from './course-tags.resolver';
import { CourseCategoriesResolver } from './course-categories.resolver';
import { TagsByCourseLoader } from '../data-loaders/tags-by-course.loader';
import { CategoriesByCourseLoader } from '../data-loaders/categories-by-course.loader';
import { CoursesRepository } from '../courses.repository';
import { Course, DatabaseModule } from '@app/common';

@Module({
	imports: [DatabaseModule.forFeature([Course])],
	providers: [
		CoursesRepository,
		TagsByCourseLoader,
		CategoriesByCourseLoader,
		CourseTagsResolver,
		CourseCategoriesResolver,
	],
	exports: [CourseTagsResolver, CourseCategoriesResolver],
})
export class FieldResolversModule {}
