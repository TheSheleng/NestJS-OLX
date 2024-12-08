import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRestPasswordToken1733684556687 implements MigrationInterface {
    name = 'AddRestPasswordToken1733684556687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetPasswordExpires\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetPasswordExpires\``);
    }

}
