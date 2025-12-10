import { Module } from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';
import { CourseProgressResolver } from './course-progress.resolver';
import { CourseProgress, DatabaseModule } from '@app/common';
import { CourseProgressRepository } from './course-progress.repository';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';

@Module({
	imports: [DatabaseModule.forFeature([CourseProgress]), LessonProgressModule],
	providers: [
		CourseProgressResolver,
		CourseProgressService,
		CourseProgressRepository,
	],
	exports: [CourseProgressService],
})
export class CourseProgressModule {}
