import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { CourseProgressStatus } from '@app/common/enums/course-progress-status.enum';
import { ChallengeAttempt } from '@app/common/entities/progress/challenge-attempt.entity';
import { LessonProgress } from '@app/common/entities/progress/lesson-progress.entity';

@ObjectType()
@Entity('course_progress')
@Index(['userId', 'courseId'], { unique: true })
export class CourseProgress extends AbstractEntity<CourseProgress> {
	@Field(() => CourseProgressStatus)
	@Column('enum', {
		enum: CourseProgressStatus,
		enumName: 'course_progress_status',
	})
	status: CourseProgressStatus;

	@Field(() => Int)
	@Column('int', { default: 0, name: 'completed_lessons_count' })
	completedLessonsCount: number;

	@Field(() => Int)
	@Column('int', { default: 0, name: 'completed_challenges_count' })
	completedChallengesCount: number;

	@Field(() => ID)
	@Column('uuid', { name: 'user_id' })
	userId: string;

	@Field(() => ID)
	@Column('uuid', { name: 'course_id' })
	courseId: string;

	@Field(() => ID, { nullable: true })
	@Column('uuid', { name: 'last_visited_item_id', nullable: true })
	lastVisitedItemId: string | null;

	@Field(() => [LessonProgress])
	@OneToMany(
		() => LessonProgress,
		lessonProgress => lessonProgress.courseProgress,
		{
			cascade: true,
		},
	)
	lessonsProgresses: LessonProgress[];

	@Field(() => [ChallengeAttempt])
	@OneToMany(
		() => ChallengeAttempt,
		challengeAttempt => challengeAttempt.courseProgress,
		{
			cascade: true,
		},
	)
	challengesAttempts: ChallengeAttempt[];

	@Field(() => Date, { nullable: true })
	@Column('timestamptz', { name: 'last_accessed_at', nullable: true })
	lastAccessedAt: Date | null;

	@Field(() => Date, { nullable: true })
	@Column('timestamptz', { name: 'completed_at', nullable: true })
	completedAt: Date | null;
}
