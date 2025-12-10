import { Injectable, Logger } from '@nestjs/common';
import { UserRatingsRepository } from './user-ratings.repository';
import {
	Course,
	DEFAULT_TAKE,
	MeDto,
	PaginationQueryInput,
	UserRating,
} from '@app/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CreateUserRatingInput } from './dto/create-user-rating.input';

@Injectable()
export class UserRatingsService {
	private readonly logger: Logger = new Logger(UserRatingsService.name);

	constructor(
		private readonly userRatingsRepository: UserRatingsRepository,
		private readonly dataSource: DataSource,
	) {}

	async rateCourse(
		user: MeDto,
		{ courseId, rating }: CreateUserRatingInput,
	): Promise<UserRating> {
		return this.dataSource.transaction(async manager => {
			const userRatingsRepo = manager.getRepository(UserRating);
			const courseRepo = manager.getRepository(Course);

			await userRatingsRepo.upsert(
				{
					userId: user.id,
					courseId,
					rating,
				},
				['userId', 'courseId'],
			);

			const builderResult = await userRatingsRepo
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

			return userRatingsRepo.findOneOrFail({
				where: { userId: user.id, courseId },
			});
		});
	}

	async find(
		paginationQueryInput: PaginationQueryInput,
	): Promise<UserRating[]> {
		return this.userRatingsRepository.find(
			{},
			{
				skip: paginationQueryInput.offset ?? 0,
				take: paginationQueryInput.limit ?? DEFAULT_TAKE,
			},
		);
	}

	async findOne(id: string): Promise<UserRating> {
		return this.userRatingsRepository.findOne({ id });
	}

	async findOneBy(where: FindOptionsWhere<UserRating>): Promise<UserRating> {
		return this.userRatingsRepository.findOne(where);
	}
}
