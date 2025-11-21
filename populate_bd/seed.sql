INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    instance_id,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data
)
VALUES
-- 1) Pedro
(
    gen_random_uuid(),
    'pedro@email.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Pedro"}'
),

-- 2) Lucas
(
    gen_random_uuid(),
    'lucas@email.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Lucas"}'
),

-- 3) Ana
(
    gen_random_uuid(),
    'ana@email.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Ana"}'
),

-- 4) Marina
(
    gen_random_uuid(),
    'marina@email.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Marina"}'
),

-- 5) Bruno
(
    gen_random_uuid(),
    'bruno@email.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Bruno"}'
);



INSERT INTO public.barbershops (
  id, name, address, phone, description, image_url,
  access_code, admin_id, created_at, instagram_url
)
VALUES (
  gen_random_uuid(),
  'Barbearia OnVee',
  'Rua Teste, 123',
  '(11) 99999-9999',
  'Barbearia exemplo para testes',
  null,
  'ONVEE123',
  '16310d31-aa37-442b-82d4-cacac16c40f2',
  now(),
  null
)
RETURNING id;


INSERT INTO public.barbers (
  id, barbershop_id, bio, rating, is_active, created_at, profile_id
)
VALUES
  (gen_random_uuid(), 'edfded32-6c28-4852-b3b6-5438a80e63b6', 'Profissional experiente', 5.0, true, now(), '0a5cf6b6-054b-4bcd-a6af-6074066530a7'),
  (gen_random_uuid(), 'edfded32-6c28-4852-b3b6-5438a80e63b6', 'Profissional experiente', 4.8, true, now(), '1e887fec-824e-4284-82d2-d44d7a65304f'),
  (gen_random_uuid(), 'edfded32-6c28-4852-b3b6-5438a80e63b6', 'Profissional experiente', 4.9, true, now(), '59b31f98-fffe-433d-9424-c4a72eec750e'),
  (gen_random_uuid(), 'edfded32-6c28-4852-b3b6-5438a80e63b6', 'Profissional experiente', 4.7, true, now(), 'b3fa2c1e-ac74-47cc-8003-d8a3ef25ac8a')
ON CONFLICT DO NOTHING;


INSERT INTO public.services (id, barbershop_id, name, description, price, duration_minutes, image_url)
VALUES 
  (
    gen_random_uuid(),
    'edfded32-6c28-4852-b3b6-5438a80e63b6',
    'Corte Masculino',
    'Corte completo com finalização.',
    40.00,
    30,
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1'
  ),
  (
    gen_random_uuid(),
    'edfded32-6c28-4852-b3b6-5438a80e63b6',
    'Barba',
    'Aparação e alinhamento de barba com toalha quente.',
    30.00,
    25,
    'https://images.unsplash.com/photo-1599351431202-1e0f01398977'
  ),
  (
    gen_random_uuid(),
    'edfded32-6c28-4852-b3b6-5438a80e63b6',
    'Sobrancelha',
    'Design simples ou alinhamento com navalha.',
    20.00,
    15,
    'https://images.unsplash.com/photo-1595878715977-2e38df1edc94'
  ),
  (
    gen_random_uuid(),
    'edfded32-6c28-4852-b3b6-5438a80e63b6',
    'Corte + Barba',
    'Combo completo com corte masculino e barba.',
    60.00,
    50,
    'https://images.unsplash.com/photo-1519741497674-611481863552'
  ),
  (
    gen_random_uuid(),
    'edfded32-6c28-4852-b3b6-5438a80e63b6',
    'Platinado',
    'Descoloração e aplicação de tonalizante claro.',
    150.00,
    120,
    'https://images.unsplash.com/photo-1598540173587-7e5fd296f2c3'
  );


-- Bruno
INSERT INTO working_hours (id, barber_id, day_of_week, start_time, end_time)
VALUES
  (gen_random_uuid(), '294f012a-6e39-4b32-8025-b4e1d2269f35', 1, '09:00', '18:00'),
  (gen_random_uuid(), '294f012a-6e39-4b32-8025-b4e1d2269f35', 2, '09:00', '18:00'),
  (gen_random_uuid(), '294f012a-6e39-4b32-8025-b4e1d2269f35', 3, '09:00', '18:00'),
  (gen_random_uuid(), '294f012a-6e39-4b32-8025-b4e1d2269f35', 4, '09:00', '18:00'),
  (gen_random_uuid(), '294f012a-6e39-4b32-8025-b4e1d2269f35', 5, '09:00', '18:00'),
  (gen_random_uuid(), '294f012a-6e39-4b32-8025-b4e1d2269f35', 6, '09:00', '18:00');

-- Marina
INSERT INTO working_hours (id, barber_id, day_of_week, start_time, end_time)
VALUES
  (gen_random_uuid(), 'a5ee1f81-8b5a-4c37-909b-94959cb4f145', 1, '09:00', '18:00'),
  (gen_random_uuid(), 'a5ee1f81-8b5a-4c37-909b-94959cb4f145', 2, '09:00', '18:00'),
  (gen_random_uuid(), 'a5ee1f81-8b5a-4c37-909b-94959cb4f145', 3, '09:00', '18:00'),
  (gen_random_uuid(), 'a5ee1f81-8b5a-4c37-909b-94959cb4f145', 4, '09:00', '18:00'),
  (gen_random_uuid(), 'a5ee1f81-8b5a-4c37-909b-94959cb4f145', 5, '09:00', '18:00'),
  (gen_random_uuid(), 'a5ee1f81-8b5a-4c37-909b-94959cb4f145', 6, '09:00', '18:00');

-- Lucas
INSERT INTO working_hours (id, barber_id, day_of_week, start_time, end_time)
VALUES
  (gen_random_uuid(), 'cdea80a2-1284-4411-94ce-cdde6ed74fce', 1, '09:00', '18:00'),
  (gen_random_uuid(), 'cdea80a2-1284-4411-94ce-cdde6ed74fce', 2, '09:00', '18:00'),
  (gen_random_uuid(), 'cdea80a2-1284-4411-94ce-cdde6ed74fce', 3, '09:00', '18:00'),
  (gen_random_uuid(), 'cdea80a2-1284-4411-94ce-cdde6ed74fce', 4, '09:00', '18:00'),
  (gen_random_uuid(), 'cdea80a2-1284-4411-94ce-cdde6ed74fce', 5, '09:00', '18:00'),
  (gen_random_uuid(), 'cdea80a2-1284-4411-94ce-cdde6ed74fce', 6, '09:00', '18:00');

-- Ana
INSERT INTO working_hours (id, barber_id, day_of_week, start_time, end_time)
VALUES
  (gen_random_uuid(), 'e3d92411-b4e5-4b70-b237-2c2e46d69ba3', 1, '09:00', '18:00'),
  (gen_random_uuid(), 'e3d92411-b4e5-4b70-b237-2c2e46d69ba3', 2, '09:00', '18:00'),
  (gen_random_uuid(), 'e3d92411-b4e5-4b70-b237-2c2e46d69ba3', 3, '09:00', '18:00'),
  (gen_random_uuid(), 'e3d92411-b4e5-4b70-b237-2c2e46d69ba3', 4, '09:00', '18:00'),
  (gen_random_uuid(), 'e3d92411-b4e5-4b70-b237-2c2e46d69ba3', 5, '09:00', '18:00'),
  (gen_random_uuid(), 'e3d92411-b4e5-4b70-b237-2c2e46d69ba3', 6, '09:00', '18:00');
