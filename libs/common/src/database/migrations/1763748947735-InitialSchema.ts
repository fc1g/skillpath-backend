import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763748947735 implements MigrationInterface {
	name = 'InitialSchema1763748947735';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."roles_name_enum" AS ENUM('user', 'admin')`,
		);
		await queryRunner.query(
			`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."roles_name_enum" NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."provider_type" AS ENUM('github', 'google')`,
		);
		await queryRunner.query(
			`CREATE TABLE "oauth_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "provider" "public"."provider_type" NOT NULL, "provider_id" character varying NOT NULL, "username" character varying(255), "email" character varying(255) NOT NULL, "user_id" uuid, CONSTRAINT "uq_oauth_user_provider" UNIQUE ("user_id", "provider"), CONSTRAINT "PK_710a81523f515b78f894e33bb10" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_22a05e92f51a983475f9281d3b" ON "oauth_accounts" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_283c974372e384adfc2c51ae18" ON "oauth_accounts" ("provider", "provider_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(64) NOT NULL, "slug" character varying(64) NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_b3aa10c29ea4e61a830362bd25" ON "tags" ("slug") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."quiz_type" AS ENUM('single-choice', 'multiple-choice')`,
		);
		await queryRunner.query(
			`CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question" text NOT NULL, "type" "public"."quiz_type" NOT NULL DEFAULT 'single-choice', "options" text array NOT NULL, "correct_option_index" integer NOT NULL, "explanation" text, "order" integer NOT NULL DEFAULT '0', "lesson_id" uuid, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_quiz_lesson_order" ON "quizzes" ("lesson_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "order" integer NOT NULL DEFAULT '0', "content" text NOT NULL, "section_id" uuid, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_lesson_section_order" ON "lessons" ("section_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_difficulty" AS ENUM('easy', 'medium', 'hard')`,
		);
		await queryRunner.query(
			`CREATE TABLE "challenges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "instructions" text NOT NULL, "requirements" text array NOT NULL, "example" text NOT NULL, "challengeDifficulty" "public"."challenge_difficulty" NOT NULL, "order" integer NOT NULL DEFAULT '0', "expected_output" text, "expected_structure" text, "section_id" uuid, CONSTRAINT "PK_1e664e93171e20fe4d6125466af" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_challenge_section" ON "challenges" ("section_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_challenge_section_order" ON "challenges" ("section_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TABLE "sections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "order" integer NOT NULL DEFAULT '0', "duration_seconds" integer NOT NULL DEFAULT '0', "course_id" uuid, CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_section_course" ON "sections" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_section_course_order" ON "sections" ("course_id", "order") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."course_level" AS ENUM('beginner', 'intermediate', 'advanced')`,
		);
		await queryRunner.query(
			`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "subtitle" character varying(255) NOT NULL, "description" text NOT NULL, "slug" character varying(255) NOT NULL, "requirements" text array NOT NULL, "learning_outcomes" text array NOT NULL, "included_features" text array NOT NULL, "level" "public"."course_level" NOT NULL DEFAULT 'beginner', "average_rating" double precision NOT NULL DEFAULT '0', "students_count" integer NOT NULL DEFAULT '0', "lessons_count" integer NOT NULL DEFAULT '0', "challenges_count" integer NOT NULL DEFAULT '0', "duration_seconds" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_a3bb2d01cfa0f95bc5e034e1b7" ON "courses" ("slug") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "course_tags" ("course_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_aee88490b15cb29d15d9503d221" PRIMARY KEY ("course_id", "tag_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_286187640dcc13dd9b308d2d6a" ON "course_tags" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_87da401f10ecb400b2f4bfcda7" ON "course_tags" ("tag_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "oauth_accounts" ADD CONSTRAINT "FK_22a05e92f51a983475f9281d3b0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_2cf4e4b5b533af8dc6b38d4fa9b" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" ADD CONSTRAINT "FK_19261e484ffd22b40ea596ece4d" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD CONSTRAINT "FK_de255d4a5fa3e2d4f609539c849" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" ADD CONSTRAINT "FK_53ccbd6e2fa20dac9062f4f4c36" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" ADD CONSTRAINT "FK_286187640dcc13dd9b308d2d6a9" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" ADD CONSTRAINT "FK_87da401f10ecb400b2f4bfcda7c" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "course_tags" DROP CONSTRAINT "FK_87da401f10ecb400b2f4bfcda7c"`,
		);
		await queryRunner.query(
			`ALTER TABLE "course_tags" DROP CONSTRAINT "FK_286187640dcc13dd9b308d2d6a9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" DROP CONSTRAINT "FK_53ccbd6e2fa20dac9062f4f4c36"`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP CONSTRAINT "FK_de255d4a5fa3e2d4f609539c849"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" DROP CONSTRAINT "FK_19261e484ffd22b40ea596ece4d"`,
		);
		await queryRunner.query(
			`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_2cf4e4b5b533af8dc6b38d4fa9b"`,
		);
		await queryRunner.query(
			`ALTER TABLE "oauth_accounts" DROP CONSTRAINT "FK_22a05e92f51a983475f9281d3b0"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_87da401f10ecb400b2f4bfcda7"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_286187640dcc13dd9b308d2d6a"`,
		);
		await queryRunner.query(`DROP TABLE "course_tags"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
		);
		await queryRunner.query(`DROP TABLE "user_roles"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_a3bb2d01cfa0f95bc5e034e1b7"`,
		);
		await queryRunner.query(`DROP TABLE "courses"`);
		await queryRunner.query(`DROP TYPE "public"."course_level"`);
		await queryRunner.query(`DROP INDEX "public"."idx_section_course_order"`);
		await queryRunner.query(`DROP INDEX "public"."idx_section_course"`);
		await queryRunner.query(`DROP TABLE "sections"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx_challenge_section_order"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx_challenge_section"`);
		await queryRunner.query(`DROP TABLE "challenges"`);
		await queryRunner.query(`DROP TYPE "public"."challenge_difficulty"`);
		await queryRunner.query(`DROP INDEX "public"."idx_lesson_section_order"`);
		await queryRunner.query(`DROP TABLE "lessons"`);
		await queryRunner.query(`DROP INDEX "public"."idx_quiz_lesson_order"`);
		await queryRunner.query(`DROP TABLE "quizzes"`);
		await queryRunner.query(`DROP TYPE "public"."quiz_type"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_b3aa10c29ea4e61a830362bd25"`,
		);
		await queryRunner.query(`DROP TABLE "tags"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_283c974372e384adfc2c51ae18"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_22a05e92f51a983475f9281d3b"`,
		);
		await queryRunner.query(`DROP TABLE "oauth_accounts"`);
		await queryRunner.query(`DROP TYPE "public"."provider_type"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
		);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`,
		);
		await queryRunner.query(`DROP TABLE "roles"`);
		await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
	}
}
