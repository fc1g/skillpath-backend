import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ClassConstructorInterface } from '@app/common/interfaces';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
	constructor(private readonly dto: ClassConstructorInterface) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(
			map((data: ClassConstructorInterface): object =>
				plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
				}),
			),
		);
	}
}
