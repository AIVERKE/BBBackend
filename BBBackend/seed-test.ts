import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/config/typeorm-migration.config';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const ds = new DataSource(dataSourceOptions);
  try {
    await ds.initialize();
    console.log('Database connected');

    // 1. Create a Tenant if not exists
    let tenant = await ds.query(`SELECT id FROM tenants LIMIT 1`);
    let tenantId;
    if (tenant.length === 0) {
      const res = await ds.query(`INSERT INTO tenants (business_name, is_active) VALUES ('Test Business', true) RETURNING id`);
      tenantId = res[0].id;
      console.log('Created tenant:', tenantId);
    } else {
      tenantId = tenant[0].id;
      console.log('Using tenant:', tenantId);
    }

    // 2. Create a Customer
    const hashedPassword = await bcrypt.hash('password123', 10);
    const existingCustomer = await ds.query(`SELECT id FROM customers WHERE username = 'testcustomer'`);
    if (existingCustomer.length === 0) {
      await ds.query(`INSERT INTO customers (tenant_id, username, phone, password_hash) VALUES (${tenantId}, 'testcustomer', 12345678, '${hashedPassword}')`);
      console.log('Created customer: testcustomer / password123');
    } else {
      console.log('Customer already exists');
    }

    // 3. Create a User (Admin)
    const existingUser = await ds.query(`SELECT id FROM users WHERE email = 'admin@test.com'`);
    if (existingUser.length === 0) {
      await ds.query(`INSERT INTO users (tenant_id, role, full_name, email, password_hash) VALUES (${tenantId}, 'admin', 'Admin User', 'admin@test.com', '${hashedPassword}')`);
      console.log('Created user: admin@test.com / password123');
    } else {
      console.log('User already exists');
    }

    await ds.destroy();
  } catch (error) {
    console.error('Error seeding:', error);
  }
}

seed();
