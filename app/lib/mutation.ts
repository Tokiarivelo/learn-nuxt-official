import { PrismaClient } from '@prisma/client';
import { InvoiceCreateArs, InvoiceWithCustomer } from './definitions';
import { formatCurrency } from './utils';

const prisma = new PrismaClient();

export async function insertInvoice(args: InvoiceCreateArs) {
  try {
    const data = await prisma.invoices.create({
      data: args,
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create invoice.');
  }
}
