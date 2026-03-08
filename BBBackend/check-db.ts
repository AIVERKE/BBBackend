import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/config/typeorm-migration.config';

async function check() {
  const ds = new DataSource(dataSourceOptions);
  try {
    await ds.initialize();
    console.log('Database connected successfully');
    
    const tables = ['users', 'customers', 'tenants', 'menu_categories', 'products'];
    for (const table of tables) {
      const result = await ds.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}')`);
      const exists = result[0].exists;
      console.log(`Table ${table} exists: ${exists}`);
      
      if (exists) {
        const columns = await ds.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`);
        console.log(`Columns for ${table}:`, (columns as any[]).map(c => c.column_name).join(', '));
      }
    }
    
    await ds.destroy();
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

check();
