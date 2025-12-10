import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeAttemptService } from './challenge-attempt.service';

describe('ChallengeAttemptService', () => {
	let service: ChallengeAttemptService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChallengeAttemptService],
		}).compile();

		service = module.get<ChallengeAttemptService>(ChallengeAttemptService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
