import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { customers, invoices, revenue, users } from '../lib/placeholder-data';

const prisma = new PrismaClient();

async function seedUsers() {
  const data = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return {
        ...user,
        password: hashedPassword,
      };
    })
  );
  const insertedUsers = await prisma.users.createMany({
    data,
    skipDuplicates: true,
  });

  console.log('insertedUsers :>> ', insertedUsers);

  return insertedUsers;
}

async function seedCustomers() {
  const data = customers;

  const insertedCustomers = await prisma.customers.createMany({
    data,
    skipDuplicates: true,
  });

  console.log('insertedCustomers :>> ', insertedCustomers);

  return insertedCustomers;
}

async function seedInvoices() {
  const data = invoices;

  const insertedInvoices = await prisma.invoices.createMany({
    data,
    skipDuplicates: true,
  });

  console.log('insertedInvoices :>> ', insertedInvoices);

  return insertedInvoices;
}

async function seedRevenue() {
  const data = revenue;

  const insertedRevenues = await prisma.revenue.createMany({
    data,
    skipDuplicates: true,
  });

  console.log('insertedRevenues :>> ', insertedRevenues);

  return insertedRevenues;
}

export async function GET() {
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.log('error :>> ', error);
    return Response.json({ error }, { status: 500 });
  }
}
