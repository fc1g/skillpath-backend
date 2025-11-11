import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDto, User } from '@app/common';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async signup(createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto);
	}
}
