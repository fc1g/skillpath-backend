import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsOptional,
	Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ChallengeDifficulty, ChallengeLanguage } from '@app/common';

@InputType()
export class CreateChallengeInput {
	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	path: string;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	title: string;

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	instructions: string;

	@Field(() => [String])
	@ApiProperty({ type: [String] })
	@IsArray()
	@ArrayNotEmpty()
	@IsNotEmpty({ each: true })
	@Expose()
	requirements: string[];

	@Field()
	@ApiProperty()
	@IsNotEmpty()
	@Expose()
	example: string;

	@Field()
	@ApiProperty()
	@IsOptional()
	@Expose()
	templateCode: string;

	@Field(() => ChallengeDifficulty)
	@ApiProperty({ enum: ChallengeDifficulty, enumName: 'ChallengeDifficulty' })
	@IsNotEmpty()
	@Expose()
	difficulty: ChallengeDifficulty;

	@Field(() => ChallengeLanguage)
	@ApiProperty({ enum: ChallengeLanguage, enumName: 'ChallengeLanguage' })
	@IsNotEmpty()
	@Expose()
	language: ChallengeLanguage;

	@Field(() => Int)
	@ApiProperty()
	@IsNotEmpty()
	@Min(0)
	@Expose()
	order: number;

	@Field(() => String, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	expectedOutput?: string | null;

	@Field(() => String, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	expectedStructure?: string | null;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	sectionId?: string;

	@Field(() => ID, { nullable: true })
	@ApiProperty()
	@IsOptional()
	@Expose()
	courseId?: string;
}
