import { Module } from '@nestjs/common';
import { ChallengeAttemptModule } from './challenge-attempt/challenge-attempt.module';
import { CourseProgressModule } from './course-progress/course-progress.module';
import { LessonProgressModule } from './lesson-progress/lesson-progress.module';
import { FieldResolversModule } from './field-resolvers/field-resolvers.module';
import { ChallengeDraftModule } from './challenge-draft/challenge-draft.module';

@Module({
	imports: [
		ChallengeAttemptModule,
		CourseProgressModule,
		LessonProgressModule,
		FieldResolversModule,
		ChallengeDraftModule,
	],
	exports: [CourseProgressModule],
})
export class ProgressModule {}
