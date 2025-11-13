import { PartialType } from '@nestjs/mapped-types';
import { CreateOAuthAccountDto } from '@app/common/dto/auth/oauth-account/create-oauth-account.dto';

export class UpdateOAuthAccountDto extends PartialType(CreateOAuthAccountDto) {}
