import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { Category, DatabaseModule } from '@app/common';
import { CategoriesRepository } from './categories.repository';

@Module({
	imports: [DatabaseModule.forFeature([Category])],
	providers: [CategoriesResolver, CategoriesService, CategoriesRepository],
	exports: [CategoriesService],
})
export class CategoriesModule {}
