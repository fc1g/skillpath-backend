// import { Injectable, Scope } from '@nestjs/common';
// import DataLoader from 'dataloader';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Course } from '@app/common';
// import { In, Repository } from 'typeorm';
//
// @Injectable({ scope: Scope.REQUEST })
// export class TagsByCoffeeLoader extends DataLoader<string, any[]> {
// 	constructor(
// 		@InjectRepository(Course)
// 		private readonly coursesRepository: Repository<Course>,
// 	) {
// 		super(keys => this.batchLoadFn(keys));
// 	}
//
// 	private async batchLoadFn(coursesIds: readonly string[]): Promise<any[][]> {
// 		const coursesWithTags = await this.coursesRepository.find({
// 			select: ['id'],
// 			relations: {
// 				tags: true,
// 			},
// 			where: {
// 				id: In(coursesIds as string[]),
// 			},
// 		});
//
// 		return coursesWithTags.map(course => course.tags);
// 	}
// }
