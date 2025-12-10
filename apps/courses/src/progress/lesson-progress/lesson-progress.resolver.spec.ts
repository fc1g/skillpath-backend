import { Test, TestingModule } from '@nestjs/testing';
import { LessonProgressResolver } from './lesson-progress.resolver';
import { LessonProgressService } from './lesson-progress.service';

describe('LessonProgressResolver', () => {
	let resolver: LessonProgressResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [LessonProgressResolver, LessonProgressService],
		}).compile();

		resolver = module.get<LessonProgressResolver>(LessonProgressResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
