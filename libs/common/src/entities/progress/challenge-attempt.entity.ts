import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { ChallengeProgressStatus } from '@app/common/enums/challenge-progress-status.enum';
import { CourseProgress } from '@app/common/entities/progress/course-progress.entity';

@ObjectType()
@Entity('challenge_attempts')
@Index(['userId', 'challengeId'])
export class ChallengeAttempt extends AbstractEntity<ChallengeAttempt> {
	@Field(() => ChallengeProgressStatus)
	@Column('enum', {
		enum: ChallengeProgressStatus,
		enumName: 'challenge_progress_status',
	})
	status: ChallengeProgressStatus;

	@Field()
	@Column('text', { name: 'submitted_code' })
	submittedCode: string;

	@Field(() => Int)
	@Column('int', { default: 1 })
	attempts: number;

	@Field()
	@Column('text', { name: 'test_results' })
	testResults: string;

	@Field(() => CourseProgress)
	@ManyToOne(
		() => CourseProgress,
		courseProgress => courseProgress.challengesAttempts,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'course_progress_id' })
	courseProgress: CourseProgress;

	@Field(() => ID)
	@Column('uuid', { name: 'user_id' })
	userId: string;

	@Field(() => ID)
	@Column('uuid', { name: 'challenge_id' })
	challengeId: string;

	@Field(() => Date, { nullable: true })
	@Column('timestamptz', { name: 'attempted_at', nullable: true })
	attemptedAt: Date | null;

	@Field(() => Date, { nullable: true })
	@Column('timestamptz', { name: 'completed_at', nullable: true })
	completedAt: Date | null;
}
