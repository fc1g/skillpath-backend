import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { Course, CreateCourseInput, UpdateCourseInput } from '@app/common';
import { plainToClass } from 'class-transformer';
import { TagsService } from './tags/tags.service';

@Injectable()
export class CoursesService {
	constructor(
		private readonly coursesRepository: CoursesRepository,
		private readonly tagsService: TagsService,
	) {}

	async create(createCourseInput: CreateCourseInput): Promise<Course> {
		const tags = await Promise.all(
			createCourseInput.tags?.map(createTagInput =>
				this.tagsService.preloadTagByName(createTagInput),
			),
		);

		const course = plainToClass(Course, {
			...createCourseInput,
			tags,
			sections: [],
		});

		return this.coursesRepository.create(course);
	}

	async find(): Promise<Course[]> {
		return this.coursesRepository.find({});
	}

	async findOne(id: string): Promise<Course> {
		return this.coursesRepository.findOne({ id });
	}

	async update(
		id: string,
		updateCourseInput: UpdateCourseInput,
	): Promise<Course> {
		return this.coursesRepository.update({ id }, updateCourseInput);
	}

	async remove(id: string): Promise<Course> {
		return this.coursesRepository.remove({ id });
	}
}
