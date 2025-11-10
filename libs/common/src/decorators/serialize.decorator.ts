import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '@app/common/interceptors';
import { ClassConstructor } from '@app/common/interfaces';

export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}
