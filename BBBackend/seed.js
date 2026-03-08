const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'bbbackend',
  });

  await client.connect();
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash('password123', salt);

  try {
    let tenantId;
    // Check if tenant exists
    const existingTenants = await client.query('SELECT id FROM tenants LIMIT 1;');
    if (existingTenants.rows.length > 0) {
      tenantId = existingTenants.rows[0].id;
    } else {
      console.log('Inserting tenant...');
      const tenantRes = await client.query(`
        INSERT INTO tenants ("businessName", "isActive") 
        VALUES ('Orko Main Restaurant Test', true) 
        RETURNING id;
      `);
      tenantId = tenantRes.rows[0].id;
    }
    
    console.log(`Using Tenant ID: ${tenantId}`);

    // Insert Users
    console.log('Inserting SUPER_USER...');
    try {
      await client.query(`
        INSERT INTO users (tenant_id, role, full_name, email, password_hash)
        VALUES ($1, 'super_user', 'Super User', 'superuser@orko.com', $2)
      `, [tenantId, passwordHash]);
      console.log('✅ Created');
    } catch(e) { console.log('⚠️ Failed (might exist)'); }

    console.log('Inserting ADMIN...');
    try {
      await client.query(`
        INSERT INTO users (tenant_id, role, full_name, email, password_hash)
        VALUES ($1, 'admin', 'Admin User', 'admin@orko.com', $2)
      `, [tenantId, passwordHash]);
      console.log('✅ Created');
    } catch(e) { console.log('⚠️ Failed (might exist)'); }

    console.log('Inserting EMPLOYEE...');
     try {
      await client.query(`
        INSERT INTO users (tenant_id, role, full_name, email, password_hash)
        VALUES ($1, 'employee', 'Employee User', 'employee@orko.com', $2)
      `, [tenantId, passwordHash]);
      console.log('✅ Created');
    } catch(e) { console.log('⚠️ Failed (might exist)'); }

    console.log('Inserting CUSTOMER...');
    try {
      await client.query(`
        INSERT INTO customers (tenant_id, username, phone, password_hash)
        VALUES ($1, 'customer123', '77788899', $2)
      `, [tenantId, passwordHash]);
      console.log('✅ Created');
    } catch(e) { console.log('⚠️ Failed (might exist)'); }

    console.log('✅ Seed complete! All passwords are: password123');
  } catch (e) {
    console.error('Error seeding DB:', e);
  } finally {
    await client.end();
  }
}

seed();
