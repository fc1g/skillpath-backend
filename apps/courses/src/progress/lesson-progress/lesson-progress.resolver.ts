import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LessonProgressService } from './lesson-progress.service';
import {
	CurrentUser,
	JwtAuthGuard,
	LessonProgress,
	MeDto,
	PaginationQueryInput,
} from '@app/common';
import { CreateLessonProgressInput } from './dto/create-lesson-progress.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UpdateLessonProgressInput } from './dto/update-lesson-progress.input';
import { LessonProgressesWithTotalObject } from './dto/lesson-progresses-with-total.object';

@Resolver(() => LessonProgress)
export class LessonProgressResolver {
	constructor(private readonly lessonProgressService: LessonProgressService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => LessonProgress, { name: 'createLessonProgress' })
	async create(
		@CurrentUser() user: MeDto,
		@Args('createLessonProgressInput')
		createLessonProgressInput: CreateLessonProgressInput,
	) {
		return this.lessonProgressService.preloadLessonProgress({
			...createLessonProgressInput,
			userId: user.id,
		});
	}

	@Query(() => LessonProgressesWithTotalObject, { name: 'lessonProgresses' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.lessonProgressService.find(paginationQueryInput);
	}

	@Query(() => LessonProgress, { name: 'lessonProgress' })
	async findOne(
		@Args('userId', { type: () => ID }, ParseUUIDPipe) userId: string,
		@Args('lessonId', { type: () => ID }, ParseUUIDPipe) lessonId: string,
	) {
		return this.lessonProgressService.findOne(userId, lessonId);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => LessonProgress, { name: 'updateLessonProgress' })
	async update(
		@CurrentUser() user: MeDto,
		@Args('updateLessonProgressInput')
		updateLessonProgressInput: UpdateLessonProgressInput,
	) {
		return this.lessonProgressService.update({
			...updateLessonProgressInput,
			userId: user.id,
		});
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => LessonProgress, { name: 'removeLessonProgress' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.lessonProgressService.remove(id);
	}
}
