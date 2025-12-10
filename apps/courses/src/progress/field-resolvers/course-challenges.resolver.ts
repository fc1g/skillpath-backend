import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ChallengeAttempt, CourseProgress } from '@app/common';
import { ChallengesByCourseLoader } from '../data-loaders/challenges-by-course.loader';

@Resolver(() => CourseProgress)
export class CourseChallengesResolver {
	constructor(
		private readonly challengesByCourseLoader: ChallengesByCourseLoader,
	) {}

	@ResolveField('challengesAttempts', () => [ChallengeAttempt])
	async getChallengesOfCourse(@Parent() courseProgress: CourseProgress) {
		return this.challengesByCourseLoader.load(courseProgress.id);
	}
}
