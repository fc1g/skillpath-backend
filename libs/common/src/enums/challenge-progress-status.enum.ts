import { registerEnumType } from '@nestjs/graphql';

export enum ChallengeProgressStatus {
	ATTEMPTED = 'attempted',
	PASSED = 'passed',
	FAILED = 'failed',
}

registerEnumType(ChallengeProgressStatus, {
	name: 'ChallengeProgressStatus',
});
