import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@app/common/dto/auth/users/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
