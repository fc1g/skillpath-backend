import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/common/entities';
import type { Request } from 'express';

const getCurrentUserByContext = (context: ExecutionContext) =>
	context.switchToHttp().getRequest<Request & { user: User }>().user;

export const CurrentUser = createParamDecorator(
	(_: unknown, context: ExecutionContext) => getCurrentUserByContext(context),
);
