import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderReferenceToOrder1772980734667 implements MigrationInterface {
    name = 'AddOrderReferenceToOrder1772980734667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_reference" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_reference"`);
    }

}
