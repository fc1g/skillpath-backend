import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeDraftService } from './challenge-draft.service';

describe('ChallengeDraftService', () => {
	let service: ChallengeDraftService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChallengeDraftService],
		}).compile();

		service = module.get<ChallengeDraftService>(ChallengeDraftService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
