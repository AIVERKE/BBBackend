import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCustomerPhoneAndCruds1772982270539 implements MigrationInterface {
    name = 'FixCustomerPhoneAndCruds1772982270539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // En caso de que haya nulos, les ponemos un valor por defecto antes de cambiar el tipo y poner NOT NULL
        await queryRunner.query(`UPDATE "customers" SET "phone" = 0 WHERE "phone" IS NULL`);
        
        // Cambia el tipo de la columna 'phone' de integer a varchar preservando datos
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "phone" TYPE character varying USING "phone"::character varying`);
        
        // Asegurar la restricción NOT NULL
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "phone" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "phone" TYPE integer USING "phone"::integer`);
    }
}
