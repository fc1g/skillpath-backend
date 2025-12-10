import { registerEnumType } from '@nestjs/graphql';

export enum CourseProgressStatus {
	ENROLLED = 'enrolled',
	IN_PROGRESS = 'in-progress',
	COMPLETED = 'completed',
}

registerEnumType(CourseProgressStatus, {
	name: 'CourseProgressStatus',
});
