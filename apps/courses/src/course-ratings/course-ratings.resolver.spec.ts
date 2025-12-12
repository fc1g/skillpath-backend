import { Test, TestingModule } from '@nestjs/testing';
import { CourseRatingsResolver } from './course-ratings.resolver';
import { CourseRatingsService } from './course-ratings.service';

describe('CourseRatingsResolver', () => {
	let resolver: CourseRatingsResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CourseRatingsResolver, CourseRatingsService],
		}).compile();

		resolver = module.get<CourseRatingsResolver>(CourseRatingsResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
