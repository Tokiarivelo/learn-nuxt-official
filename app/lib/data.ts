import { PrismaClient } from '@prisma/client';
import { InvoiceWithCustomer } from './definitions';
import { formatCurrency } from './utils';

const prisma = new PrismaClient();

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.revenue.findMany();

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoices.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
      include: {
        customer: true,
      },
    });

    const latestInvoices: InvoiceWithCustomer[] = data.map(
      (invoice) =>
        ({
          ...invoice,
          amount: formatCurrency(invoice.amount),
        } as InvoiceWithCustomer)
    );

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  // 1️⃣ Compter le nombre de factures
  const invoiceCountPromise = prisma.invoices.count();

  // 2️⃣ Compter le nombre de clients
  const customerCountPromise = prisma.customers.count();

  // 3️⃣ Calculer le total des factures payées et en attente
  const invoiceStatusPromise = prisma.invoices.groupBy({
    by: ['status'],
    _sum: { amount: true },
    where: { status: { in: ['paid', 'pending'] } }, // On ne récupère que ces statuts
  });

  // 4️⃣ Attendre toutes les promesses en parallèle
  const [numberOfInvoices, numberOfCustomers, invoiceStatus] =
    await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

  // 5️⃣ Extraire et formater les valeurs
  const totalPaidInvoices = formatCurrency(
    invoiceStatus.find((i) => i.status === 'paid')?._sum.amount ?? 0
  );
  const totalPendingInvoices = formatCurrency(
    invoiceStatus.find((i) => i.status === 'pending')?._sum.amount ?? 0
  );

  return {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  };
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoices.findMany({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: 'insensitive' } } }, // Equivalent de `ILIKE`
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          }, // Recherche par montant
          {
            date: {
              equals: isNaN(Date.parse(query)) ? undefined : new Date(query),
            },
          }, // Recherche par date
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const totalInvoices = await prisma.invoices.count({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: 'insensitive' } } }, // Equivalent de ILIKE
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          }, // Recherche par montant
          {
            date: {
              equals: isNaN(Date.parse(query)) ? undefined : new Date(query),
            },
          }, // Recherche par date
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    const totalPages = Math.ceil(totalInvoices / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return {
      ...invoice,
      amount: invoice.amount / 100, // Convertit les cents en dollars
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
