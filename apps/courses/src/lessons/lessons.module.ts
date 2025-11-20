import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsResolver } from './lessons.resolver';
import { DatabaseModule, Lesson } from '@app/common';
import { LessonsRepository } from './lessons.repository';

@Module({
	imports: [DatabaseModule.forFeature([Lesson])],
	providers: [LessonsResolver, LessonsService, LessonsRepository],
	exports: [LessonsService],
})
export class LessonsModule {}
