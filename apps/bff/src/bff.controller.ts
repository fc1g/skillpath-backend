import { Controller } from '@nestjs/common';
import { BffService } from './bff.service';

@Controller()
export class BffController {
	constructor(private readonly bffService: BffService) {}
}
