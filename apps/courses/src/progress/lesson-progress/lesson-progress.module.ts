import { Module } from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import { LessonProgressResolver } from './lesson-progress.resolver';
import { DatabaseModule, LessonProgress } from '@app/common';
import { LessonProgressRepository } from './lesson-progress.repository';

@Module({
	imports: [DatabaseModule.forFeature([LessonProgress])],
	providers: [
		LessonProgressResolver,
		LessonProgressService,
		LessonProgressRepository,
	],
	exports: [LessonProgressService],
})
export class LessonProgressModule {}
