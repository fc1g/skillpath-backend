import { registerEnumType } from '@nestjs/graphql';

export enum LastVisitedItemType {
	LESSON = 'lesson',
	CHALLENGE = 'challenge',
}

registerEnumType(LastVisitedItemType, {
	name: 'LastVisitedItemType',
});
