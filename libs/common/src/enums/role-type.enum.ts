import { registerEnumType } from '@nestjs/graphql';

export enum RoleType {
	USER = 'user',
	ADMIN = 'admin',
}

registerEnumType(RoleType, { name: 'RoleType' });
