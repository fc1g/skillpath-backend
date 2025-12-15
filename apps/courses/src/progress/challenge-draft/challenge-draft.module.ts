import { Module } from '@nestjs/common';
import { ChallengeDraftService } from './challenge-draft.service';
import { ChallengeDraftResolver } from './challenge-draft.resolver';
import { ChallengeDraft, DatabaseModule } from '@app/common';
import { ChallengeDraftRepository } from './challenge-draft.repository';

@Module({
	imports: [DatabaseModule.forFeature([ChallengeDraft])],
	providers: [
		ChallengeDraftResolver,
		ChallengeDraftService,
		ChallengeDraftRepository,
	],
	exports: [ChallengeDraftService],
})
export class ChallengeDraftModule {}
