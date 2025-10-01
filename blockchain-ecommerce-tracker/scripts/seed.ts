import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'TREE_PLANT_001' },
      update: {},
      create: {
        sku: 'TREE_PLANT_001',
        title: 'Tree Planting Initiative',
        description: 'Support reforestation efforts in the Amazon rainforest',
        price: 25.00,
        metadata: {
          category: 'environment',
          impact: 'trees_planted',
          region: 'amazon',
        },
      },
    }),
    prisma.product.upsert({
      where: { sku: 'WATER_WELL_001' },
      update: {},
      create: {
        sku: 'WATER_WELL_001',
        title: 'Clean Water Initiative',
        description: 'Help build clean water wells in rural communities',
        price: 50.00,
        metadata: {
          category: 'health',
          impact: 'people_served',
          region: 'africa',
        },
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SOLAR_PANEL_001' },
      update: {},
      create: {
        sku: 'SOLAR_PANEL_001',
        title: 'Solar Energy Project',
        description: 'Install solar panels in underserved communities',
        price: 100.00,
        metadata: {
          category: 'energy',
          impact: 'co2_reduced',
          region: 'global',
        },
      },
    }),
    prisma.product.upsert({
      where: { sku: 'EDUCATION_001' },
      update: {},
      create: {
        sku: 'EDUCATION_001',
        title: 'Education Support',
        description: 'Provide educational materials and teacher training',
        price: 30.00,
        metadata: {
          category: 'education',
          impact: 'children_helped',
          region: 'asia',
        },
      },
    }),
    prisma.product.upsert({
      where: { sku: 'OCEAN_CLEANUP_001' },
      update: {},
      create: {
        sku: 'OCEAN_CLEANUP_001',
        title: 'Ocean Cleanup',
        description: 'Support ocean plastic cleanup initiatives',
        price: 40.00,
        metadata: {
          category: 'environment',
          impact: 'plastic_removed',
          region: 'ocean',
        },
      },
    }),
  ]);

  console.log('✅ Products created:', products.length);

  // Create sample initiatives
  const initiatives = await Promise.all([
    prisma.initiative.upsert({
      where: { slug: 'amazon-reforestation' },
      update: {},
      create: {
        slug: 'amazon-reforestation',
        title: 'Amazon Reforestation Project',
        description: 'Restoring the Amazon rainforest through strategic tree planting and community engagement.',
        lat: -3.4653,
        lng: -62.2159,
        region: 'Amazon Basin, Brazil',
        status: 'IN_PROGRESS',
        metadata: {
          goal: 'plant_10000_trees',
          current: 7500,
          startDate: '2024-01-01',
          expectedCompletion: '2024-12-31',
        },
      },
    }),
    prisma.initiative.upsert({
      where: { slug: 'clean-water-africa' },
      update: {},
      create: {
        slug: 'clean-water-africa',
        title: 'Clean Water for Africa',
        description: 'Building sustainable water infrastructure in rural African communities.',
        lat: 8.7832,
        lng: 34.5085,
        region: 'East Africa',
        status: 'IN_PROGRESS',
        metadata: {
          goal: 'build_50_wells',
          current: 32,
          startDate: '2024-02-01',
          expectedCompletion: '2024-11-30',
        },
      },
    }),
    prisma.initiative.upsert({
      where: { slug: 'solar-energy-global' },
      update: {},
      create: {
        slug: 'solar-energy-global',
        title: 'Global Solar Initiative',
        description: 'Bringing clean, renewable energy to underserved communities worldwide.',
        lat: 20.0,
        lng: 0.0,
        region: 'Global',
        status: 'IN_PROGRESS',
        metadata: {
          goal: 'install_1000_panels',
          current: 650,
          startDate: '2024-03-01',
          expectedCompletion: '2025-02-28',
        },
      },
    }),
  ]);

  console.log('✅ Initiatives created:', initiatives.length);

  // Create sample initiative updates
  const updates = await Promise.all([
    prisma.initiativeUpdate.create({
      data: {
        initiativeId: initiatives[0].id,
        authorId: admin.id,
        type: 'PROGRESS',
        content: 'Great progress this month! We planted 500 new trees in the northern section of our reforestation area. The saplings are showing excellent growth rates with 95% survival rate.',
        images: ['https://via.placeholder.com/400x300/22c55e/ffffff?text=Tree+Planting'],
        summaryAI: 'Planted 500 trees with 95% survival rate in northern reforestation area.',
        tags: ['progress', 'trees', 'growth', 'success'],
        published: true,
      },
    }),
    prisma.initiativeUpdate.create({
      data: {
        initiativeId: initiatives[1].id,
        authorId: admin.id,
        type: 'MILESTONE',
        content: 'Milestone achieved! We completed the 30th water well this week. The new well in the village of Kigali is now providing clean water to over 200 families.',
        images: ['https://via.placeholder.com/400x300/3b82f6/ffffff?text=Water+Well'],
        summaryAI: 'Completed 30th water well, serving 200+ families in Kigali village.',
        tags: ['milestone', 'water', 'well', 'community'],
        published: true,
      },
    }),
    prisma.initiativeUpdate.create({
      data: {
        initiativeId: initiatives[2].id,
        authorId: admin.id,
        type: 'PROGRESS',
        content: 'Solar panel installation is ahead of schedule! We installed 150 panels this month across 3 communities, bringing clean energy to over 500 households.',
        images: ['https://via.placeholder.com/400x300/f59e0b/ffffff?text=Solar+Panels'],
        summaryAI: 'Installed 150 solar panels, powering 500+ households across 3 communities.',
        tags: ['solar', 'energy', 'progress', 'households'],
        published: true,
      },
    }),
  ]);

  console.log('✅ Initiative updates created:', updates.length);

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
      },
    }),
  ]);

  console.log('✅ Sample users created:', users.length);

  // Create sample purchases
  const purchases = await Promise.all([
    prisma.purchase.create({
      data: {
        userId: users[0].id,
        productId: products[0].id,
        initiativeId: initiatives[0].id,
        quantity: 2,
        total: 50.00,
        orderId: 'ORDER_001',
        status: 'BLOCKCHAIN_MINTED',
        blockchainTokenId: 'token_001',
        txHash: '0x1234567890abcdef1234567890abcdef12345678',
      },
    }),
    prisma.purchase.create({
      data: {
        userId: users[1].id,
        productId: products[1].id,
        initiativeId: initiatives[1].id,
        quantity: 1,
        total: 50.00,
        orderId: 'ORDER_002',
        status: 'BLOCKCHAIN_MINTED',
        blockchainTokenId: 'token_002',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
    }),
  ]);

  console.log('✅ Sample purchases created:', purchases.length);

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'PURCHASE_CONFIRMED',
        payload: {
          purchaseId: purchases[0].id,
          tokenId: purchases[0].blockchainTokenId,
          initiativeTitle: initiatives[0].title,
        },
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'INITIATIVE_UPDATE',
        payload: {
          initiativeId: initiatives[0].id,
          initiativeTitle: initiatives[0].title,
          updateId: updates[0].id,
        },
      },
    }),
  ]);

  console.log('✅ Sample notifications created:', notifications.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`- Admin user: admin@example.com (password: admin123)`);
  console.log(`- Sample users: john@example.com, jane@example.com (password: password123)`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Initiatives: ${initiatives.length}`);
  console.log(`- Updates: ${updates.length}`);
  console.log(`- Purchases: ${purchases.length}`);
  console.log(`- Notifications: ${notifications.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
