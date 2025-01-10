import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategories1733696760788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO category (name) VALUES
            ('Electronics'),
            ('Books'),
            ('Clothing'),
            ('Home & Kitchen'),
            ('Sports'),
            ('Toys');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM category WHERE name IN (
                'Electronics',
                'Books',
                'Clothing',
                'Home & Kitchen',
                'Sports',
                'Toys'
            );
        `);
    }

}
