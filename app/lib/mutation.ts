import { PrismaClient } from '@prisma/client';
import { InvoiceCreateArgs, InvoiceUpdateArgs } from './definitions';

const prisma = new PrismaClient();

export async function insertInvoice(args: InvoiceCreateArgs) {
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

export async function modifyInvoice(id: string, args: InvoiceUpdateArgs) {
  try {
    const data = await prisma.invoices.update({
      data: args,
      where: {
        id,
      },
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update invoice.');
  }
}

export async function deletenvoiceDb(id: string) {
  try {
    const data = await prisma.invoices.delete({
      where: {
        id,
      },
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete invoice.');
  }
}
