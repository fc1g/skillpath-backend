import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	CurrentUser,
	MeDto,
	Roles,
	RoleType,
	Serialize,
	UpdateUserDto,
	UpdateUserRolesDto,
	User,
	UserDto,
	UsersDto,
} from '@app/common';
import { AccessJwtGuard } from '../guards/access-jwt.guard';
import { UserMapper } from './mappers/user.mapper';

@UseGuards(AccessJwtGuard)
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
	@Serialize(MeDto)
	getUser(@CurrentUser() currentUser: User): MeDto {
		return UserMapper.toMeDto(currentUser);
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

	@Roles(RoleType.ADMIN)
	@Patch(':id/roles')
	@Serialize(UserDto)
	async updateUserRoles(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() updateUserRolesDto: UpdateUserRolesDto,
	): Promise<User> {
		return this.usersService.updateUserRoles(id, updateUserRolesDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
		return this.usersService.remove(id);
	}
}
