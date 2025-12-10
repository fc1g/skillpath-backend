import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { Section } from '@app/common/entities/courses/section.entity';
import { ChallengeDifficulty } from '@app/common/enums';
import { ChallengeLanguage } from '@app/common/enums/challenge-language.enum';

@ObjectType()
@Entity('challenges')
@Index('idx_challenge_section_order', ['section', 'order'], { unique: true })
export class Challenge extends AbstractEntity<Challenge> {
	@Field()
	@Column('varchar', { length: 64, unique: true })
	path: string;

	@Field()
	@Column('varchar', { length: 255 })
	title: string;

	@Field()
	@Column('text')
	instructions: string;

	@Field(() => [String])
	@Column('text', { array: true })
	requirements: string[];

	@Field()
	@Column('text')
	example: string;

	@Field(() => String, {
		description: 'The code template to be used for this challenge',
	})
	@Column('text')
	templateCode: string;

	@Field(() => ChallengeDifficulty)
	@Column('enum', {
		enum: ChallengeDifficulty,
		enumName: 'challenge_difficulty',
	})
	difficulty: ChallengeDifficulty;

	@Field(() => ChallengeLanguage)
	@Column('enum', {
		enum: ChallengeLanguage,
		enumName: 'challenge_language',
	})
	language: ChallengeLanguage;

	@Field(() => Int)
	@Column('int', { default: 0 })
	order: number;

	@Field(() => String, {
		nullable: true,
	})
	@Column('text', { name: 'expected_output', nullable: true })
	expectedOutput?: string | null;

	@Field({ nullable: true })
	@Column('text', {
		name: 'expected_structure',
		nullable: true,
	})
	expectedStructure?: string | null;

	@Field(() => Section)
	@Index('idx_challenge_section', ['section'])
	@ManyToOne(() => Section, section => section.challenges, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'section_id' })
	section: Section;

	@Field(() => ID)
	@Column('uuid', { name: 'course_id' })
	courseId: string;
}
