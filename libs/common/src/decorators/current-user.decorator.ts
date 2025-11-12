import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/common/entities';
import type { Request } from 'express';
import { RefreshTokenPayloadInterface } from '@app/common/interfaces';

const getCurrentUserByContext = (context: ExecutionContext) =>
	context
		.switchToHttp()
		.getRequest<Request & { user: User | RefreshTokenPayloadInterface }>().user;

export const CurrentUser = createParamDecorator(
	(_: unknown, context: ExecutionContext) => getCurrentUserByContext(context),
);
