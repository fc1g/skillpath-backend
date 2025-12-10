import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763748947735 implements MigrationInterface {
	name = 'InitialSchema1763748947735';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_progress_status" AS ENUM('attempted', 'passed', 'failed')`,
		);
		await queryRunner.query(
			`CREATE TABLE "challenge_attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."challenge_progress_status" NOT NULL, "submitted_code" text NOT NULL, "attempts" integer NOT NULL DEFAULT '1', "test_results" text NOT NULL, "user_id" uuid NOT NULL, "challenge_id" uuid NOT NULL, "attempted_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "course_progress_id" uuid, CONSTRAINT "PK_ec04be45a63caa94d1d3d0d681e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_3ed6dab084a2053c5d3a1c7231" ON "challenge_attempts" ("user_id", "challenge_id") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."course_progress_status" AS ENUM('enrolled', 'in-progress', 'completed')`,
		);
		await queryRunner.query(
			`CREATE TABLE "course_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."course_progress_status" NOT NULL, "completed_lessons_count" integer NOT NULL DEFAULT '0', "completed_challenges_count" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, "last_visited_item_id" uuid, "last_accessed_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_eadd1b31d44023e533eb847c4f7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_578f66595af7b446be0f546468" ON "course_progress" ("user_id", "course_id") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."lesson_progress_status" AS ENUM('not-started', 'completed')`,
		);
		await queryRunner.query(
			`CREATE TABLE "lesson_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."lesson_progress_status" NOT NULL, "user_id" uuid NOT NULL, "lesson_id" uuid NOT NULL, "course_progress_id" uuid, CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_f34e3a227170e0ce674e0afb58" ON "lesson_progress" ("user_id", "lesson_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "course_id" uuid NOT NULL, "rating" smallint NOT NULL, "review" text, CONSTRAINT "PK_9de3e405c7a1a3a8ce4c0715993" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_05458c90c4a18c2dab1a474e8b" ON "user_ratings" ("course_id") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_27948c289ffe27c32fba0fc76a" ON "user_ratings" ("user_id", "course_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP COLUMN "challengeDifficulty"`,
		);
		await queryRunner.query(`DROP TYPE "public"."challenge_difficulty"`);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP COLUMN "description"`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" DROP COLUMN "duration_seconds"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" ADD "duration_seconds" integer NOT NULL DEFAULT '0'`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" ADD "course_id" uuid NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "path" character varying(64) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD CONSTRAINT "UQ_40aec9fdb0c582eaa651adc3f05" UNIQUE ("path")`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "templateCode" text NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "difficulty" "public"."challenge_difficulty" NOT NULL`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_language" AS ENUM('javascript', 'typescript')`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "language" "public"."challenge_language" NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "course_id" uuid NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" ADD CONSTRAINT "UQ_3dad32ba0ff20feee98b1b0c43d" UNIQUE ("title")`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" ADD CONSTRAINT "UQ_c673c8ef8cac3fe461b73297f36" UNIQUE ("title")`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenge_attempts" ADD CONSTRAINT "FK_b9edaab946c11666009d11bac64" FOREIGN KEY ("course_progress_id") REFERENCES "course_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_b451a501ce61a80a20f3dc260a1" FOREIGN KEY ("course_progress_id") REFERENCES "course_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_b451a501ce61a80a20f3dc260a1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenge_attempts" DROP CONSTRAINT "FK_b9edaab946c11666009d11bac64"`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" DROP CONSTRAINT "UQ_c673c8ef8cac3fe461b73297f36"`,
		);
		await queryRunner.query(
			`ALTER TABLE "lessons" DROP CONSTRAINT "UQ_3dad32ba0ff20feee98b1b0c43d"`,
		);
		await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "course_id"`);
		await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "language"`);
		await queryRunner.query(`DROP TYPE "public"."challenge_language"`);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP COLUMN "difficulty"`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP COLUMN "templateCode"`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" DROP CONSTRAINT "UQ_40aec9fdb0c582eaa651adc3f05"`,
		);
		await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "path"`);
		await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "course_id"`);
		await queryRunner.query(
			`ALTER TABLE "lessons" DROP COLUMN "duration_seconds"`,
		);
		await queryRunner.query(
			`ALTER TABLE "sections" ADD "duration_seconds" integer NOT NULL DEFAULT '0'`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "description" text NOT NULL`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."challenge_difficulty" AS ENUM('easy', 'medium', 'hard')`,
		);
		await queryRunner.query(
			`ALTER TABLE "challenges" ADD "challengeDifficulty" "public"."challenge_difficulty" NOT NULL`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_27948c289ffe27c32fba0fc76a"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_05458c90c4a18c2dab1a474e8b"`,
		);
		await queryRunner.query(`DROP TABLE "user_ratings"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_f34e3a227170e0ce674e0afb58"`,
		);
		await queryRunner.query(`DROP TABLE "lesson_progress"`);
		await queryRunner.query(`DROP TYPE "public"."lesson_progress_status"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_578f66595af7b446be0f546468"`,
		);
		await queryRunner.query(`DROP TABLE "course_progress"`);
		await queryRunner.query(`DROP TYPE "public"."course_progress_status"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_3ed6dab084a2053c5d3a1c7231"`,
		);
		await queryRunner.query(`DROP TABLE "challenge_attempts"`);
		await queryRunner.query(`DROP TYPE "public"."challenge_progress_status"`);
	}
}
