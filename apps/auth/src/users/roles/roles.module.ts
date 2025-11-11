import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule, Role } from '@app/common';
import { RolesRepository } from './roles.repository';

@Module({
	imports: [DatabaseModule.forFeature([Role])],
	controllers: [RolesController],
	providers: [RolesService, RolesRepository],
	exports: [RolesService],
})
export class RolesModule {}
