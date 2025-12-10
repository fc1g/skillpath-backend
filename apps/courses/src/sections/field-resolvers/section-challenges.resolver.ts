import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Challenge, Section } from '@app/common';
import { ChallengesBySectionLoader } from '../data-loaders/challenges-by-section.loader';

@Resolver(() => Section)
export class SectionChallengesResolver {
	constructor(
		private readonly challengesBySectionLoader: ChallengesBySectionLoader,
	) {}

	@ResolveField('challenges', () => [Challenge])
	async getChallengesOfSection(@Parent() section: Section) {
		return this.challengesBySectionLoader.load(section.id);
	}
}
