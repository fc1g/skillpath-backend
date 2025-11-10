import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ClassConstructor } from '@app/common/interfaces';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
	constructor(private readonly dto: ClassConstructor) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(
			map((data: ClassConstructor): object =>
				plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
				}),
			),
		);
	}
}
