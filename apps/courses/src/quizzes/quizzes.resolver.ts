import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import {
	JwtAuthGuard,
	Lesson,
	PaginationQueryInput,
	Quiz,
	Roles,
	RoleType,
} from '@app/common';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';

@Resolver(() => Quiz)
export class QuizzesResolver {
	constructor(private readonly quizzesService: QuizzesService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Lesson, { name: 'createQuiz' })
	async create(@Args('createQuizInput') createQuizInput: CreateQuizInput) {
		return this.quizzesService.preloadQuiz(createQuizInput);
	}

	@Query(() => [Quiz], { name: 'quizzes' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.quizzesService.find(paginationQueryInput);
	}

	@Query(() => Quiz, { name: 'quiz' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.quizzesService.findOne(id);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Lesson, { name: 'updateQuiz' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateQuizInput') updateQuizInput: UpdateQuizInput,
	) {
		return this.quizzesService.update(id, updateQuizInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Lesson, { name: 'removeQuiz' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.quizzesService.remove(id);
	}
}
