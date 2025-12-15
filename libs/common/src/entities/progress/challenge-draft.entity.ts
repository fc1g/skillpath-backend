import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '@app/common/database';

@ObjectType()
@Entity('challenge_drafts')
@Index(['userId', 'challengeId'], { unique: true })
export class ChallengeDraft extends AbstractEntity<ChallengeDraft> {
	@Field()
	@Column('text')
	code: string;

	@Field(() => ID)
	@Column('uuid', { name: 'user_id' })
	userId: string;

	@Field(() => ID)
	@Column('uuid', { name: 'challenge_id' })
	challengeId: string;
}
