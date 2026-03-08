const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to database to seed products.');

    const tenantId = 1;

    // Insert Categories
    const categories = [
      { name: 'Starters' },
      { name: 'Main Courses' },
      { name: 'Side Dishes' },
      { name: 'Desserts' },
      { name: 'Beverages' }
    ];

    const categoryIds = {};

    for (const cat of categories) {
      const res = await client.query(
        `INSERT INTO menu_categories (name, tenant_id) VALUES ($1, $2) RETURNING id`,
        [cat.name, tenantId]
      );
      categoryIds[cat.name] = res.rows[0].id;
    }

    console.log('Categories created:', categoryIds);

    // Insert Products
    const products = [
      {
        name: 'Heirloom Burrata',
        description: 'Creamy pugliese burrata, heirloom cherry tomatoes, cold-pressed olive oil and aged balsamic.',
        price: 24.00,
        categoryId: categoryIds['Starters']
      },
      {
        name: 'Black Truffle Pizza',
        description: 'House-made sourdough crust, fior di latte, shaved winter truffles and organic egg yolk.',
        price: 38.00,
        categoryId: categoryIds['Main Courses']
      },
      {
        name: 'Braised Short Rib',
        description: '12-hour braised Wagyu beef, silk potato purée, glazed root vegetables and red wine jus.',
        price: 46.00,
        categoryId: categoryIds['Main Courses']
      },
      {
        name: 'Miso Glazed Salmon',
        description: 'Wild caught Atlantic salmon, ginger-miso glaze, baby bok choy and sesame brittle.',
        price: 42.00,
        categoryId: categoryIds['Main Courses']
      },
      {
        name: 'Valrhona Fondant',
        description: 'Warm chocolate center, Madagascar vanilla bean gelato and gold leaf garnish.',
        price: 18.00,
        categoryId: categoryIds['Desserts']
      },
      {
        name: 'Botanical Gin Fizz',
        description: 'Premium small-batch gin, elderflower liqueur, fresh cucumber and mint foam.',
        price: 16.00,
        categoryId: categoryIds['Beverages']
      },
      {
        name: 'Prime Beef Tartare',
        description: 'Hand-cut beef tenderloin, capers, shallots, Dijon and house-made crostini.',
        price: 26.00,
        categoryId: categoryIds['Starters']
      },
      {
        name: 'Linguine Vongole',
        description: 'Fresh pasta, manilla clams, garlic, chili flakes and a splash of Vermentino.',
        price: 34.00,
        categoryId: categoryIds['Main Courses']
      }
    ];

    for (const prod of products) {
      await client.query(
        `INSERT INTO products (name, description, price, category_id, tenant_id, is_available) 
         VALUES ($1, $2, $3, $4, $5, true)`,
        [prod.name, prod.description, prod.price, prod.categoryId, tenantId]
      );
    }

    console.log('Successfully seeded products!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await client.end();
  }
}

main();
