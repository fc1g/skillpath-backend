import {
	ConflictException,
	Injectable,
	Logger,
	OnModuleInit,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, RoleType } from '@app/common';

@Injectable()
export class AdminSeeder implements OnModuleInit {
	private readonly logger: Logger = new Logger(AdminSeeder.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
	) {}

	async onModuleInit() {
		const createUserDto: CreateUserDto = {
			email: this.configService.getOrThrow<string>('DATABASE_ADMIN_EMAIL'),
			password: this.configService.getOrThrow<string>(
				'DATABASE_ADMIN_PASSWORD',
			),
		};

		try {
			await this.usersService.create(createUserDto, RoleType.ADMIN);
			this.logger.log('✅ Admin created successfully');
		} catch (error) {
			if (error instanceof ConflictException) {
				this.logger.warn('ℹ️ Admin already exists');
			} else {
				this.logger.error('❌ Failed to seed admin: ', error);
			}
		}
	}
}
