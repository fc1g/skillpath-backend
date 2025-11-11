import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { DatabaseModule, User } from '@app/common';
import { RolesModule } from './roles/roles.module';
import { AdminSeeder } from './seeders/admin.seeder';

@Module({
	imports: [DatabaseModule.forFeature([User]), RolesModule],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository, AdminSeeder],
	exports: [UsersService],
})
export class UsersModule {}
