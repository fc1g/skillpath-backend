import { registerEnumType } from '@nestjs/graphql';

export enum CourseLevel {
	BEGINNER = 'beginner',
	INTERMEDIATE = 'intermediate',
	ADVANCED = 'advanced',
}

registerEnumType(CourseLevel, { name: 'CourseLevel' });
