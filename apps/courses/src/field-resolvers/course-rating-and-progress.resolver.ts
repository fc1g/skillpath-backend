import { Injectable, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CourseRatingsService } from '../course-ratings/course-ratings.service';
import { CourseProgressService } from '../progress/course-progress/course-progress.service';
import { CurrentUser, JwtAuthGuard, MeDto } from '@app/common';
import { Args, ID, Query } from '@nestjs/graphql';
import { CourseRatingAndProgressObject } from '../dto/course-rating-and-progress.object';

@Injectable()
export class CourseRatingAndProgressResolver {
	constructor(
		private readonly courseRatingsService: CourseRatingsService,
		private readonly courseProgressService: CourseProgressService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Query(() => CourseRatingAndProgressObject, {
		name: 'courseRatingAndProgress',
	})
	async getRatingAndProgress(
		@CurrentUser() user: MeDto,
		@Args('courseId', { type: () => ID }, ParseUUIDPipe) courseId: string,
	): Promise<CourseRatingAndProgressObject> {
		const courseProgress = await this.courseProgressService.findOneBy({
			userId: user.id,
			courseId,
		});

		const courseRating = await this.courseRatingsService.findOneBy({
			userId: user.id,
			courseId,
		});

		if (!courseRating) {
			return { progress: courseProgress, rating: null, review: null };
		}

		return {
			progress: courseProgress,
			rating: courseRating?.rating ?? null,
			review: courseRating?.review ?? null,
		};
	}
}
