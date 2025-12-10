import { Test, TestingModule } from '@nestjs/testing';
import { UserRatingsResolver } from './user-ratings.resolver';
import { UserRatingsService } from './user-ratings.service';

describe('UserRatingsResolver', () => {
	let resolver: UserRatingsResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserRatingsResolver, UserRatingsService],
		}).compile();

		resolver = module.get<UserRatingsResolver>(UserRatingsResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
