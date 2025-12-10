import { Module } from '@nestjs/common';
import { UserRatingsService } from './user-ratings.service';
import { UserRatingsResolver } from './user-ratings.resolver';
import { DatabaseModule, UserRating } from '@app/common';
import { UserRatingsRepository } from './user-ratings.repository';

@Module({
	imports: [DatabaseModule.forFeature([UserRating])],
	providers: [UserRatingsResolver, UserRatingsService, UserRatingsRepository],
	exports: [UserRatingsService],
})
export class UserRatingsModule {}
