import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesResolver } from './challenges.resolver';
import { ChallengesService } from './challenges.service';

describe('ChallengesResolver', () => {
	let resolver: ChallengesResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChallengesResolver, ChallengesService],
		}).compile();

		resolver = module.get<ChallengesResolver>(ChallengesResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
