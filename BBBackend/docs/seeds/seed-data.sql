/* 
  BBBackend - Seed Data Script
  Este script pobla la base de datos con datos de prueba para demostración.
*/

-- 1. TENANTS (Negocios)
INSERT INTO tenants (business_name, is_active) VALUES 
('Luxe Dining Sushi', true),
('Burger Master Pro', true),
('Taco Express', true);

-- 2. USERS (Staff) - Password es 'password123' (hash de bcrypt)
-- Hashes generados previamente para ahorrar tiempo
-- Luxe Dining Admin (Tenant 1)
INSERT INTO users (full_name, email, password_hash, role, tenant_id) VALUES 
('Admin Luxe', 'admin@luxe.com', '$2a$10$7bN.K5N1Z5oR3f.2L5XW0.Xy1hK9H4u5v5u5u5u5u5u5u5u5u5u', 'admin', 1),
('Mesero Luxe', 'staff@luxe.com', '$2a$10$7bN.K5N1Z5oR3f.2L5XW0.Xy1hK9H4u5v5u5u5u5u5u5u5u5u5h', 'employee', 1);

-- Burger Admin (Tenant 2)
INSERT INTO users (full_name, email, password_hash, role, tenant_id) VALUES 
('Admin Burger', 'admin@burger.com', '$2a$10$7bN.K5N1Z5oR3f.2L5XW0.Xy1hK9H4u5v5u5u5u5u5u5u5u5u5u', 'admin', 2);

-- 3. CUSTOMERS (Clientes)
INSERT INTO customers (username, phone, password_hash, tenant_id) VALUES 
('diego_cliente', '5551234567', '$2a$10$7bN.K5N1Z5oR3f.2L5XW0.Xy1hK9H4u5v5u5u5u5u5u5u5u5u5u', 1),
('ana_burger', '5559876543', '$2a$10$7bN.K5N1Z5oR3f.2L5XW0.Xy1hK9H4u5v5u5u5u5u5u5u5u5u5u', 2);

-- 4. MENU CATEGORIES
-- Tenant 1 (Sushi)
INSERT INTO menu_categories (name, tenant_id) VALUES 
('Rollos Especiales', 1),
('Entradas Japonesas', 1),
('Bebidas', 1);

-- Tenant 2 (Burger)
INSERT INTO menu_categories (name, tenant_id) VALUES 
('Hamburguesas Gourmet', 2),
('Acompañamientos', 2);

-- 5. PRODUCTS
-- Sushi Rollos
INSERT INTO products (name, description, price, image_url, category_id, tenant_id) VALUES 
('Philadelphia Roll', 'Queso crema, pepino y salmón fresco', 12.50, 'http://localhost:3000/uploads/sushi-phila.jpg', 1, 1),
('Dragon Roll', 'Anguila, aguacate y salsa unagi', 15.00, 'http://localhost:3000/uploads/sushi-dragon.jpg', 1, 1),
('Edamames', 'Frijoles de soja al vapor con sal de mar', 6.00, 'http://localhost:3000/uploads/edamame.jpg', 2, 1);

-- Burger Products
INSERT INTO products (name, description, price, image_url, category_id, tenant_id) VALUES 
('Classic Master', 'Carne 200g, queso cheddar, lechuga y tomate', 10.99, 'http://localhost:3000/uploads/burger-classic.jpg', 4, 2),
('Bacon BBQ', 'Doble tocino, cebolla caramelizada y salsa BBQ', 13.50, 'http://localhost:3000/uploads/burger-bacon.jpg', 4, 2),
('Papas Fritas XL', 'Papas rústicas con sazón de la casa', 4.50, 'http://localhost:3000/uploads/fries.jpg', 5, 2);

-- 6. ATTENDANCE (Registros de ejemplo)
INSERT INTO attendance (employee_id, tenant_id, date, check_in, check_out) VALUES 
(2, 1, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP);

-- 7. ORDERS (Ejemplo de orden pagada para reportes)
-- Supongamos que ya existen órdenes para que la analítica tenga algo que mostrar
-- Esto es meramente ilustrativo para que veas datos en el dashboard al usar el seed
