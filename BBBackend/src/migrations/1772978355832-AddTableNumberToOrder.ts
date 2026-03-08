import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableNumberToOrder1772978355832 implements MigrationInterface {
    name = 'AddTableNumberToOrder1772978355832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "table_number" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "table_number"`);
    }

}
