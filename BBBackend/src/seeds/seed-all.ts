import { DataSource } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Attendance } from '../entities/attendance.entity';
import { AccountingLedger } from '../entities/accounting-ledger.entity';
import { UserRole, OrderStatus } from '../common/enums/database.enum';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { dataSourceOptions } from '../config/typeorm-migration.config';

async function seed() {
  const dataSource = new DataSource({
    ...dataSourceOptions,
    entities: [
      Tenant,
      User,
      MenuCategory,
      Product,
      Customer,
      Order,
      OrderItem,
      Attendance,
      AccountingLedger,
    ],
  });
  await dataSource.initialize();

  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Cleaning database...');
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
  }

  console.log('Seeding Tenants...');
  const tenants = await dataSource.getRepository(Tenant).save([
    { businessName: 'Restaurante Gourmet Orko', logoUrl: 'https://placehold.co/200x200?text=Gourmet', isActive: true },
    { businessName: 'Cafetería Central', logoUrl: 'https://placehold.co/200x200?text=Cafeteria', isActive: true },
    { businessName: 'Bar La Noche', logoUrl: 'https://placehold.co/200x200?text=Bar', isActive: true },
  ]);

  console.log('Seeding Users...');
  const users: User[] = [
    {
      fullName: 'Super Admin Global',
      email: 'super@orko.com',
      passwordHash,
      role: UserRole.SUPER_USER,
      tenantId: null as any,
    } as User,
  ];

  for (const tenant of tenants) {
    users.push({
      fullName: `Admin ${tenant.businessName}`,
      email: `admin@${tenant.businessName.toLowerCase().replace(/\s/g, '')}.com`,
      passwordHash,
      role: UserRole.ADMIN,
      tenantId: tenant.id,
    } as User);

    users.push({
      fullName: `Staff 1 ${tenant.businessName}`,
      email: `staff1@${tenant.businessName.toLowerCase().replace(/\s/g, '')}.com`,
      passwordHash,
      role: UserRole.EMPLOYEE,
      tenantId: tenant.id,
    } as User);

    users.push({
      fullName: `Staff 2 ${tenant.businessName}`,
      email: `staff2@${tenant.businessName.toLowerCase().replace(/\s/g, '')}.com`,
      passwordHash,
      role: UserRole.EMPLOYEE,
      tenantId: tenant.id,
    } as User);
  }
  const savedUsers = await dataSource.getRepository(User).save(users);

  console.log('Seeding Menu Categories and Products...');
  for (const tenant of tenants) {
    const categories = await dataSource.getRepository(MenuCategory).save([
      { name: 'Entradas', description: 'Abridores de apetito', tenantId: tenant.id },
      { name: 'Platos Fuertes', description: 'Lo mejor de la casa', tenantId: tenant.id },
      { name: 'Bebidas', description: 'Refrescantes', tenantId: tenant.id },
      { name: 'Postres', description: 'Dulce final', tenantId: tenant.id },
    ]);

    for (const category of categories) {
      const products = [];
      for (let i = 1; i <= 5; i++) {
        products.push({
          name: `${category.name} ${i}`,
          description: `Descripción deliciosa para ${category.name} número ${i}`,
          price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
          isAvailable: true,
          tenantId: tenant.id,
          categoryId: category.id,
        });
      }
      await dataSource.getRepository(Product).save(products);
    }

    console.log(`Seeding Customers for ${tenant.businessName}...`);
    const customers = [];
    for (let i = 1; i <= 10; i++) {
        customers.push({
            username: `cliente${i}_${tenant.id}`,
            phone: `700000${tenant.id}${i}`.substring(0, 8),
            passwordHash,
            tenantId: tenant.id
        });
    }
    const savedCustomers = await dataSource.getRepository(Customer).save(customers);

    console.log(`Seeding Orders for ${tenant.businessName}...`);
    const tenantProducts = await dataSource.getRepository(Product).findBy({ tenantId: tenant.id });
    const tenantStaff = savedUsers.filter(u => u.tenantId === tenant.id && u.role === UserRole.EMPLOYEE);

    for (const customer of savedCustomers) {
        for (let j = 1; j <= 3; j++) {
            const order = await dataSource.getRepository(Order).save({
                tenantId: tenant.id,
                customerId: customer.id,
                employeeId: tenantStaff[Math.floor(Math.random() * tenantStaff.length)].id,
                qrToken: uuidv4(),
                orderReference: `Mesa ${Math.floor(Math.random() * 20) + 1}`,
                status: Math.random() > 0.3 ? OrderStatus.PAID : OrderStatus.PENDING,
                totalAmount: 0,
            });

            let total = 0;
            const items = [];
            for (let k = 0; k < 3; k++) {
                const product = tenantProducts[Math.floor(Math.random() * tenantProducts.length)];
                const qty = Math.floor(Math.random() * 3) + 1;
                const subtotal = parseFloat((product.price * qty).toString());
                items.push({
                    orderId: order.id,
                    productId: product.id,
                    quantity: qty,
                    unitPrice: product.price,
                    subtotal: subtotal
                });
                total += subtotal;
            }
            await dataSource.getRepository(OrderItem).save(items);
            order.totalAmount = total;
            if (order.status === OrderStatus.PAID) {
                order.amountReceived = total + 10;
                order.changeGiven = 10;
                
                // Add to accounting
                await dataSource.getRepository(AccountingLedger).save({
                    tenantId: tenant.id,
                    orderId: order.id,
                    transactionType: 'income',
                    concept: `Venta de pedido #${order.id}`,
                    amount: total
                });
            }
            await dataSource.getRepository(Order).save(order);
        }
    }

    console.log(`Seeding Attendance for ${tenant.businessName}...`);
    const attendances = [];
    const today = new Date();
    for (const employee of tenantStaff) {
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            attendances.push({
                tenantId: tenant.id,
                employeeId: employee.id,
                checkIn: new Date(date.setHours(8, 0, 0, 0)),
                checkOut: new Date(date.setHours(17, 0, 0, 0)),
                date: dateStr
            });
        }
    }
    await dataSource.getRepository(Attendance).save(attendances);
  }

  console.log('Seeding completed successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
