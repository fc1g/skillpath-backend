import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { MeDto } from '@app/common/dto';

const getCurrentUserByContext = (
	context: ExecutionContext,
): MeDto | undefined => {
	const contextType = context.getType();

	if (contextType === 'http') {
		return context.switchToHttp().getRequest<Request & { user?: MeDto }>().user;
	}

	const gqlContext = GqlExecutionContext.create(context);
	const ctx = gqlContext.getContext<{ user?: MeDto }>();
	return ctx?.user;
};

export const CurrentUser = createParamDecorator(
	(_: unknown, context: ExecutionContext) => getCurrentUserByContext(context),
);
