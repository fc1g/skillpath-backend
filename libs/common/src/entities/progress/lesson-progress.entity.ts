import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common/database';
import { LessonProgressStatus } from '@app/common/enums/lesson-progress-status.enum';
import { CourseProgress } from '@app/common/entities/progress/course-progress.entity';

@ObjectType()
@Entity('lesson_progress')
@Index(['userId', 'lessonId'], { unique: true })
export class LessonProgress extends AbstractEntity<LessonProgress> {
	@Field(() => LessonProgressStatus)
	@Column('enum', {
		enum: LessonProgressStatus,
		enumName: 'lesson_progress_status',
	})
	status: LessonProgressStatus;

	@Field(() => CourseProgress)
	@ManyToOne(
		() => CourseProgress,
		courseProgress => courseProgress.lessonsProgresses,
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
	@Column('uuid', { name: 'lesson_id' })
	lessonId: string;
}
