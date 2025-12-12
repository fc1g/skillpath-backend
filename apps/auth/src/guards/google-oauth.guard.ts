import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
	override getAuthenticateOptions(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest<Request>();

		const state = req.query.state as string | undefined;

		return {
			state,
		};
	}
}
