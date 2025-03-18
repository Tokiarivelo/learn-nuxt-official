'use server';

import { z } from 'zod';
import { deletenvoiceDb, insertInvoice, modifyInvoice } from './mutation';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);

  const amountInCents = amount * 100;
  try {
    await insertInvoice({
      customer_id: customerId,
      amount: amountInCents,
      status,
      // date,
    });
  } catch (error) {
    console.log('error :>> ', error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);

  const amountInCents = amount * 100;
  try {
    await modifyInvoice(id, {
      customer_id: customerId,
      amount: amountInCents,
      status,
      // date,
    });
  } catch (error) {
    console.log('error :>> ', error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  await deletenvoiceDb(id);

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
