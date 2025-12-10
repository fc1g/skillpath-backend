import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import {
	JwtAuthGuard,
	Lesson,
	PaginationQueryInput,
	Roles,
	RoleType,
} from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { LessonsWithTotalObject } from './dto/lessons-with-total.object';

@ApiTags('Lessons')
@Resolver(() => Lesson)
export class LessonsResolver {
	constructor(private readonly lessonsService: LessonsService) {}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Lesson, { name: 'createLesson' })
	async create(
		@Args('createLessonInput') createLessonInput: CreateLessonInput,
	) {
		return this.lessonsService.create(createLessonInput);
	}

	@Query(() => LessonsWithTotalObject, { name: 'lessons' })
	async findAll(
		@Args('paginationQueryInput') paginationQueryInput: PaginationQueryInput,
	) {
		return this.lessonsService.find(paginationQueryInput);
	}

	@Query(() => Lesson, { name: 'lesson' })
	async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.lessonsService.findOne(id);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Lesson, { name: 'updateLesson' })
	async update(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@Args('updateLessonInput') updateLessonInput: UpdateLessonInput,
	) {
		return this.lessonsService.update(id, updateLessonInput);
	}

	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Lesson, { name: 'removeLesson' })
	async delete(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
		return this.lessonsService.remove(id);
	}
}
