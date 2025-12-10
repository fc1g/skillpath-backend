import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRatingsService } from '../user-ratings/user-ratings.service';
import { CourseProgressService } from '../progress/course-progress/course-progress.service';
import { Args, Query } from '@nestjs/graphql';
import { CourseUserRatingAndProgressObject } from '../dto/course-user-rating-and-progress.object';
import { CourseUserRatingAndProgressInput } from '../dto/course-user-rating-and-progress.input';

@Injectable()
export class CourseUserRatingAndProgressResolver {
	constructor(
		private readonly userRatingsService: UserRatingsService,
		private readonly courseProgressService: CourseProgressService,
	) {}

	@Query(() => CourseUserRatingAndProgressObject, {
		name: 'courseUserRatingAndProgress',
	})
	async courseUserRatingAndProgress(
		@Args('courseUserRatingAndProgressInput')
		courseUserRatingAndProgressInput: CourseUserRatingAndProgressInput,
	) {
		const where = {
			userId: courseUserRatingAndProgressInput.userId,
			courseId: courseUserRatingAndProgressInput.courseId,
		};
		let CourseUserRatingAndProgressObject: Partial<CourseUserRatingAndProgressObject> =
			{};

		try {
			const userRating = await this.userRatingsService.findOneBy(where);
			CourseUserRatingAndProgressObject.rating = userRating.rating;
			CourseUserRatingAndProgressObject.review = userRating.review;
		} catch (err) {
			if (err instanceof NotFoundException) {
				CourseUserRatingAndProgressObject = {
					rating: null,
					review: null,
				};
			} else {
				throw err;
			}
		}

		CourseUserRatingAndProgressObject.progress =
			await this.courseProgressService.findOneBy(where);
		return CourseUserRatingAndProgressObject;
	}
}
