import { AbstractEntity } from '@app/common/database';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	OneToMany,
} from 'typeorm';
import { Section, Tag } from '@app/common/entities';
import { CourseLevel } from '@app/common/enums';
import slugify from 'slugify';

@ObjectType()
@Entity('courses')
@Index(['slug'], { unique: true })
export class Course extends AbstractEntity<Course> {
	@Field()
	@Column('varchar', { length: 255 })
	title: string;

	@Field()
	@Column('varchar', { length: 255 })
	subtitle: string;

	@Field()
	@Column('text')
	description: string;

	@Field()
	@Column('varchar', { length: 255 })
	slug: string;

	@Field(() => [String])
	@Column('text', { array: true })
	requirements: string[];

	@Field(() => [String])
	@Column('text', { array: true, name: 'learning_outcomes' })
	learningOutcomes: string[];

	@Field(() => [String])
	@Column('text', { array: true, name: 'included_features' })
	includedFeatures: string[];

	@Field(() => CourseLevel)
	@Column('enum', {
		enum: CourseLevel,
		enumName: 'course_level',
		default: CourseLevel.BEGINNER,
	})
	level: CourseLevel;

	@Field(() => Float)
	@Column('float', { default: 0, name: 'average_rating' })
	averageRating: number;

	@Field(() => Int)
	@Column('int', { default: 0, name: 'students_count' })
	studentsCount: number;

	@Field(() => Int)
	@Column('int', { default: 0, name: 'lessons_count' })
	lessonsCount: number;

	@Field(() => Int)
	@Column('int', { default: 0, name: 'challenges_count' })
	challengesCount: number;

	@Field(() => Int, {
		description: 'Total duration in seconds',
	})
	@Column('int', { default: 0, name: 'duration_seconds' })
	durationSeconds: number;

	@Field(() => [Tag])
	@ManyToMany(() => Tag, { cascade: ['insert'] })
	@JoinTable({
		name: 'course_tags',
		joinColumn: { name: 'course_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
	})
	tags: Tag[];

	@Field(() => [Section])
	@OneToMany(() => Section, section => section.course, {
		cascade: true,
	})
	sections: Section[];

	@Field(() => Int, {
		description: 'Total duration in hours (rounded up)',
	})
	get durationHours(): number {
		return Math.ceil(this.durationSeconds / 3600);
	}

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		if (this.title) {
			this.slug = slugify(this.title, {
				lower: true,
				strict: true,
				replacement: '-',
				locale: 'en',
			});
		}
	}
}
