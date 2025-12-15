import { Module } from '@nestjs/common';
import { CourseTagsResolver } from './course-tags.resolver';
import { CourseCategoriesResolver } from './course-categories.resolver';
import { TagsByCourseLoader } from '../data-loaders/tags-by-course.loader';
import { CategoriesByCourseLoader } from '../data-loaders/categories-by-course.loader';
import { CoursesRepository } from '../courses.repository';
import { Course, DatabaseModule } from '@app/common';
import { CourseSectionsResolver } from './course-sections.resolver';
import { SectionsByCourseLoader } from '../data-loaders/sections-by-course.loader';
import { ProgressByCourseLoader } from '../data-loaders/progress-by-course.loader';
import { CourseProgressResolver } from './course-progress.resolver';

@Module({
	imports: [DatabaseModule.forFeature([Course])],
	providers: [
		CoursesRepository,
		TagsByCourseLoader,
		CategoriesByCourseLoader,
		SectionsByCourseLoader,
		ProgressByCourseLoader,
		CourseTagsResolver,
		CourseCategoriesResolver,
		CourseSectionsResolver,
		CourseProgressResolver,
	],
	exports: [
		CourseTagsResolver,
		CourseCategoriesResolver,
		CourseSectionsResolver,
	],
})
export class FieldResolversModule {}
