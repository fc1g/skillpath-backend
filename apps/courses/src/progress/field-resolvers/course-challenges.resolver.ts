import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ChallengeAttempt, CourseProgress } from '@app/common';
import { ChallengesByCourseProgressLoader } from '../data-loaders/challenges-by-course-progress.loader';

@Resolver(() => CourseProgress)
export class CourseChallengesResolver {
	constructor(
		private readonly challengesByCourseProgressLoader: ChallengesByCourseProgressLoader,
	) {}

	@ResolveField('challengesAttempts', () => [ChallengeAttempt])
	async getChallengesOfCourse(@Parent() courseProgress: CourseProgress) {
		return this.challengesByCourseProgressLoader.load(courseProgress.id);
	}
}
