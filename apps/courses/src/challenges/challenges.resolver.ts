import { Resolver } from '@nestjs/graphql';
import { ChallengesService } from './challenges.service';
import { Challenge } from '@app/common';

@Resolver(() => Challenge)
export class ChallengesResolver {
	constructor(private readonly challengesService: ChallengesService) {}
}
