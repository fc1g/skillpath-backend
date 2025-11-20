import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';
import { DatabaseModule, Section } from '@app/common';
import { SectionsRepository } from './sections.repository';

@Module({
	imports: [DatabaseModule.forFeature([Section])],
	providers: [SectionsResolver, SectionsService, SectionsRepository],
	exports: [SectionsService],
})
export class SectionsModule {}
