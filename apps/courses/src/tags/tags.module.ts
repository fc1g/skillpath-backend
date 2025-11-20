import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { DatabaseModule, Tag } from '@app/common';
import { TagsRepository } from './tags.repository';

@Module({
	imports: [DatabaseModule.forFeature([Tag])],
	providers: [TagsResolver, TagsService, TagsRepository],
	exports: [TagsService],
})
export class TagsModule {}
