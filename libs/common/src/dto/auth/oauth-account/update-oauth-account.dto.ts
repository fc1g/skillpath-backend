import { PartialType } from '@nestjs/swagger';
import { CreateOAuthAccountDto } from '@app/common/dto/auth/oauth-account/create-oauth-account.dto';

export class UpdateOAuthAccountDto extends PartialType(CreateOAuthAccountDto) {}
