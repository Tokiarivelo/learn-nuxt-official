import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listInvoices(amount: number) {
  const data = await prisma.invoices.findMany({
    where: {
      amount,
    },
    select: {
      amount: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  return data;
}

export async function GET() {
  try {
    return Response.json(await listInvoices(666));
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
