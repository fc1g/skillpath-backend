import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';
import { DatabaseModule, Section } from '@app/common';
import { SectionsRepository } from './sections.repository';
import { LessonsBySectionLoader } from './data-loaders/lessons-by-section.loader';
import { SectionLessonsResolver } from './field-resolvers/section-lessons.resolver';
import { LessonsModule } from '../lessons/lessons.module';
import { ChallengesModule } from '../challenges/challenges.module';
import { CourseBySectionLoader } from './data-loaders/course-by-section.loader';
import { SectionCourseResolver } from './field-resolvers/section-course.resolver';
import { ChallengesBySectionLoader } from './data-loaders/challenges-by-section.loader';
import { SectionChallengesResolver } from './field-resolvers/section-challenges.resolver';

@Module({
	imports: [
		DatabaseModule.forFeature([Section]),
		LessonsModule,
		ChallengesModule,
	],
	providers: [
		SectionsResolver,
		SectionsService,
		SectionsRepository,
		LessonsBySectionLoader,
		SectionLessonsResolver,
		CourseBySectionLoader,
		SectionCourseResolver,
		ChallengesBySectionLoader,
		SectionChallengesResolver,
	],
	exports: [SectionsService],
})
export class SectionsModule {}
