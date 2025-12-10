import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeAttemptResolver } from './challenge-attempt.resolver';
import { ChallengeAttemptService } from './challenge-attempt.service';

describe('ChallengeAttemptResolver', () => {
	let resolver: ChallengeAttemptResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChallengeAttemptResolver, ChallengeAttemptService],
		}).compile();

		resolver = module.get<ChallengeAttemptResolver>(ChallengeAttemptResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
