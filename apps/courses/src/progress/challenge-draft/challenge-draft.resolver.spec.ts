import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeDraftResolver } from './challenge-draft.resolver';
import { ChallengeDraftService } from './challenge-draft.service';

describe('ChallengeDraftResolver', () => {
	let resolver: ChallengeDraftResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChallengeDraftResolver, ChallengeDraftService],
		}).compile();

		resolver = module.get<ChallengeDraftResolver>(ChallengeDraftResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
