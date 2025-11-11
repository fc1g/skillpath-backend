import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async verifyUser(email: string, password: string): Promise<User> {
		const user = await this.usersRepository.findOne({ email });

		if (!user.password) {
			throw new BadRequestException('Please sign in with your provider');
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new UnauthorizedException('Credentials are not valid');
		}
		return user;
	}
}
