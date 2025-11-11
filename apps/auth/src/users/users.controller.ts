import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	CurrentUser,
	Roles,
	RoleType,
	Serialize,
	UpdateUserDto,
	User,
	UserDto,
	UsersDto,
} from '@app/common';

// TODO: @UseGuards(AccessJwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Roles(RoleType.ADMIN)
	@Get()
	@Serialize(UsersDto)
	async findAll(): Promise<User[]> {
		return this.usersService.find();
	}

	@Get('me')
	@Serialize(UserDto)
	getUser(@CurrentUser() currentUser: User): User {
		return currentUser;
	}

	@Roles(RoleType.ADMIN)
	@Get(':id')
	@Serialize(UserDto)
	async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
		return this.usersService.findOne(id);
	}

	@Patch(':id')
	@Serialize(UserDto)
	async update(
		@Param('id', new ParseUUIDPipe()) id: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
		return this.usersService.remove(id);
	}
}
