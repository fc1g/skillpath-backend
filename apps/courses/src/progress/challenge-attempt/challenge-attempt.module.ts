import { Module } from '@nestjs/common';
import { ChallengeAttemptService } from './challenge-attempt.service';
import { ChallengeAttemptResolver } from './challenge-attempt.resolver';
import { ChallengeAttempt, DatabaseModule } from '@app/common';
import { ChallengeAttemptRepository } from './challenge-attempt.repository';

@Module({
	imports: [DatabaseModule.forFeature([ChallengeAttempt])],
	providers: [
		ChallengeAttemptResolver,
		ChallengeAttemptService,
		ChallengeAttemptRepository,
	],
	exports: [ChallengeAttemptService],
})
export class ChallengeAttemptModule {}
