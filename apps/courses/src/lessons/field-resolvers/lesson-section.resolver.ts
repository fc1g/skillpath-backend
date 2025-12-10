import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lesson, Section } from '@app/common';
import { SectionByLessonLoader } from '../data-loaders/section-by-lesson.loader';

@Resolver(() => Lesson)
export class LessonSectionResolver {
	constructor(private readonly sectionByLessonLoader: SectionByLessonLoader) {}

	@ResolveField('section', () => Section)
	async getSectionOfLesson(@Parent() lesson: Lesson) {
		return this.sectionByLessonLoader.load(lesson.id);
	}
}
