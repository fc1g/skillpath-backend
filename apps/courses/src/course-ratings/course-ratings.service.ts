import { Injectable, Logger } from '@nestjs/common';
import { CourseRatingsRepository } from './course-ratings.repository';
import {
	Course,
	CourseRating,
	DEFAULT_TAKE,
	MeDto,
	PaginationQueryInput,
} from '@app/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CreateCourseRatingInput } from './dto/create-course-rating.input';
import { CourseRatingsWithTotalObject } from './dto/course-ratings-with-total.object';

@Injectable()
export class CourseRatingsService {
	private readonly logger: Logger = new Logger(CourseRatingsService.name);

	constructor(
		private readonly courseRatingsRepository: CourseRatingsRepository,
		private readonly dataSource: DataSource,
	) {}

	async rateCourse(
		user: MeDto,
		{ courseId, rating }: CreateCourseRatingInput,
	): Promise<CourseRating> {
		return this.dataSource.transaction(async manager => {
			const courseRatingsRepo = manager.getRepository(CourseRating);
			const courseRepo = manager.getRepository(Course);

			await courseRatingsRepo.upsert(
				{
					userId: user.id,
					courseId,
					rating,
				},
				['userId', 'courseId'],
			);

			const builderResult = await courseRatingsRepo
				.createQueryBuilder('userRating')
				.select('AVG(userRating.rating)', 'avg')
				.addSelect('COUNT(userRating.rating)', 'count')
				.where('userRating.courseId = :courseId', { courseId })
				.getRawOne<{ avg: string | null; count: string | null }>();

			const averageRating =
				builderResult && builderResult.avg ? parseFloat(builderResult.avg) : 0;
			const ratingsCount =
				builderResult && builderResult.count
					? parseInt(builderResult.count, 10)
					: 0;

			await courseRepo.update(
				{
					id: courseId,
				},
				{
					averageRating,
					ratingsCount,
				},
			);

			return courseRatingsRepo.findOneOrFail({
				where: { userId: user.id, courseId },
			});
		});
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<CourseRatingsWithTotalObject> {
		return this.courseRatingsRepository.findWithTotal(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<CourseRating> {
		return this.courseRatingsRepository.findOne({ id });
	}

	async findOneBy(
		where: FindOptionsWhere<CourseRating>,
	): Promise<CourseRating | null> {
		try {
			return await this.courseRatingsRepository.findOne(where);
		} catch (err) {
			if (
				err instanceof Error &&
				(err as { status?: number })?.status === 404
			) {
				return null;
			}
			throw err;
		}
	}
}
