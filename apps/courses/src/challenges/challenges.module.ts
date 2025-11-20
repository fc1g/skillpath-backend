import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesResolver } from './challenges.resolver';
import { Challenge, DatabaseModule } from '@app/common';
import { ChallengesRepository } from './challenges.repository';

@Module({
	imports: [DatabaseModule.forFeature([Challenge])],
	providers: [ChallengesResolver, ChallengesService, ChallengesRepository],
	exports: [ChallengesService],
})
export class ChallengesModule {}
