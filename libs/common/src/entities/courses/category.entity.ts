import { AbstractEntity } from '@app/common/database';
import { Field, ObjectType } from '@nestjs/graphql';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	Index,
	ManyToMany,
} from 'typeorm';
import slugify from 'slugify';
import { Course } from '@app/common/entities';

@ObjectType()
@Entity('categories')
@Index(['slug'], { unique: true })
export class Category extends AbstractEntity<Category> {
	@Field()
	@Column('varchar', { length: 255, unique: true })
	name: string;

	@Field()
	@Column('varchar', { length: 255 })
	slug: string;

	@Field(() => [Course])
	@ManyToMany(() => Course, course => course.categories)
	courses: Course[];

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		if (this.name) {
			this.slug = slugify(this.name, {
				lower: true,
				strict: true,
				replacement: '-',
				locale: 'en',
			});
		}
	}
}
