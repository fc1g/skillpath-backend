import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ChallengeProgressStatus } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';
import { Expose } from 'class-transformer';

@InputType()
export class CreateChallengeAttemptInput {
	@Field(() => ChallengeProgressStatus)
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	status: ChallengeProgressStatus;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	submittedCode: string;

	@Field(() => Int)
	@ApiProperty()
	@IsNotEmpty()
	@Min(0)
	@Expose()
	attempts: number;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	testResults: string;

	@Field(() => ID)
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	courseProgressId: string;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@IsUUID()
	@Expose()
	userId?: string;

	@Field(() => ID)
	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	@Expose()
	challengeId: string;

	@Field(() => Date)
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	attemptedAt: Date;
}
