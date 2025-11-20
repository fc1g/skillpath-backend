import { Resolver } from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import { Lesson } from '@app/common';

@Resolver(() => Lesson)
export class LessonsResolver {
	constructor(private readonly lessonsService: LessonsService) {}
}
