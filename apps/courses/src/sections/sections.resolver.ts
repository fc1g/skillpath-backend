import { Resolver } from '@nestjs/graphql';
import { SectionsService } from './sections.service';
import { Section } from '@app/common';

@Resolver(() => Section)
export class SectionsResolver {
	constructor(private readonly sectionsService: SectionsService) {}
}
