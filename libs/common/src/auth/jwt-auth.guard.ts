import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import type { Request } from 'express';
import { AUTH_SERVICE } from '@app/common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@app/common/enums';
import { ROLES_KEY } from '@app/common/decorators';
import { MeDto } from '@app/common/dto';
import { GqlExecutionContext } from '@nestjs/graphql';

type RequestWithUser = Request & { user?: MeDto };

@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
		private readonly reflector: Reflector,
	) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const { req, gqlCtx } = this.getExecutionContext(context);

		const jwt = this.extractToken(req);

		if (!jwt) throw new UnauthorizedException('Unauthorized');

		const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		return this.authClient
			.send<MeDto>('authenticate', {
				Authentication: jwt,
			})
			.pipe(
				tap((user: MeDto) => {
					if (
						requiredRoles?.length &&
						!this.hasRequiredRoles(user, requiredRoles)
					) {
						this.logger.error('The user does not have required roles');
						throw new UnauthorizedException();
					}

					req.user = user;
					if (gqlCtx) {
						gqlCtx.user = user;
					}
				}),
				map(() => true),
				catchError(err => {
					this.logger.error(err);
					return of(false);
				}),
			);
	}

	private getExecutionContext(context: ExecutionContext): {
		req: RequestWithUser;
		gqlCtx?: { req: RequestWithUser; user?: MeDto };
	} {
		if (context.getType() === 'http') {
			return { req: context.switchToHttp().getRequest<RequestWithUser>() };
		}

		const gqlCtx = GqlExecutionContext.create(context).getContext<{
			req: RequestWithUser;
		}>();

		return {
			req: gqlCtx.req,
			gqlCtx,
		};
	}

	private extractToken(req: Request): string | null {
		const cookieToken = req.cookies?.['accessToken'] as string | undefined;
		if (cookieToken) return cookieToken;

		const authHeader = req.headers?.authorization;
		if (!authHeader) return null;

		const [scheme, token] = authHeader.split(' ');
		if (scheme === 'Bearer' && token) return token;

		return authHeader;
	}

	private hasRequiredRoles(user: MeDto, requiredRoles: RoleType[]): boolean {
		return requiredRoles.some(role => user.roles.includes(role));
	}
}
