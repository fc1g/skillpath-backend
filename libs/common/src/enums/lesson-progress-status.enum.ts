import { registerEnumType } from '@nestjs/graphql';

export enum LessonProgressStatus {
	NOT_STARTED = 'not-started',
	COMPLETED = 'completed',
}

registerEnumType(LessonProgressStatus, {
	name: 'LessonProgressStatus',
});
