import { Resolver } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { Quiz } from '@app/common';

@Resolver(() => Quiz)
export class QuizzesResolver {
	constructor(private readonly quizzesService: QuizzesService) {}
}
