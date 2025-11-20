import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { DatabaseModule, Quiz } from '@app/common';
import { QuizzesRepository } from './quizzes.repository';

@Module({
	imports: [DatabaseModule.forFeature([Quiz])],
	providers: [QuizzesResolver, QuizzesService, QuizzesRepository],
	exports: [QuizzesService],
})
export class QuizzesModule {}
