import { Module } from '@nestjs/common';
import { CourseRating, DatabaseModule } from '@app/common';
import { CourseRatingsRepository } from './course-ratings.repository';
import { CourseRatingsService } from './course-ratings.service';
import { CourseRatingsResolver } from './course-ratings.resolver';

@Module({
	imports: [DatabaseModule.forFeature([CourseRating])],
	providers: [
		CourseRatingsResolver,
		CourseRatingsService,
		CourseRatingsRepository,
	],
	exports: [CourseRatingsService],
})
export class CourseRatingsModule {}
