import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LessonProgressService } from './lesson-progress.service';
import { LessonProgress, PaginationQueryInput } from '@app/common';
import { CreateLessonProgressInput } from './dto/create-lesson-progress.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateLessonProgressInput } from './dto/update-lesson-progress.input';
import { LessonsWithTotalObject } from '../../lessons/dto/lessons-with-total.object';

@Resolver(() => LessonProgress)
export class LessonProgressResolver {
	constructor(private readonly lessonProgressService: LessonProgressService) {}

	@Mutation(() => LessonProgress, { name: 'createLessonProgress' })
	async create(
		@Args('createLessonProgressInput')
		createLessonProgressInput: CreateLessonProgressInput,
	) {
		return this.lessonProgressService.preloadLessonProgress(
			createLessonProgressInput,
		);
	}

	@Query(() => LessonsWithTotalObject, { name: 'lessonProgresses' })
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

	@Mutation(() => LessonProgress, { name: 'updateLessonProgress' })
	async update(
		@Args('updateLessonProgressInput')
		updateLessonProgressInput: UpdateLessonProgressInput,
	) {
		return this.lessonProgressService.update(updateLessonProgressInput);
	}

	@Mutation(() => LessonProgress, { name: 'removeLessonProgress' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.lessonProgressService.remove(id);
	}
}
