import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lesson, Section } from '@app/common';
import { LessonsBySectionLoader } from '../data-loaders/lessons-by-section.loader';

@Resolver(() => Section)
export class SectionLessonsResolver {
	constructor(
		private readonly lessonsBySectionLoader: LessonsBySectionLoader,
	) {}

	@ResolveField('lessons', () => [Lesson])
	async getLessonsOfSection(@Parent() section: Section) {
		return this.lessonsBySectionLoader.load(section.id);
	}
}
