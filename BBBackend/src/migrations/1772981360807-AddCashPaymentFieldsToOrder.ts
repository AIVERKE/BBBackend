import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCashPaymentFieldsToOrder1772981360807 implements MigrationInterface {
    name = 'AddCashPaymentFieldsToOrder1772981360807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "amount_received" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "change_given" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "change_given"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "amount_received"`);
    }

}
