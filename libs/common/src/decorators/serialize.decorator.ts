import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '@app/common/interceptors';
import { ClassConstructorInterface } from '@app/common/interfaces';

export function Serialize(dto: ClassConstructorInterface) {
	return UseInterceptors(new SerializeInterceptor(dto));
}
