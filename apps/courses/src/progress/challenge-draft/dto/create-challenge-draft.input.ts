import { Field, ID, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

@InputType()
export class CreateChallengeDraftInput {
	@Field()
	@ApiProperty()
	@Expose()
	code: string;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@IsUUID()
	@Expose()
	userId?: string | null;

	@Field(() => ID)
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	challengeId: string;
}
