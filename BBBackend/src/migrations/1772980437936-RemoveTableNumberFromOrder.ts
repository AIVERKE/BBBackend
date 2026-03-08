import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTableNumberFromOrder1772980437936 implements MigrationInterface {
    name = 'RemoveTableNumberFromOrder1772980437936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "table_number"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "table_number" integer`);
    }

}
