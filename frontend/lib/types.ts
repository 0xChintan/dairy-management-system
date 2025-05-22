import { Database } from './database.types';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type Entry = Database['public']['Tables']['entries']['Row'];
export type Bill = Database['public']['Tables']['bills']['Row'];

export type CustomerWithDetails = Customer & {
  entries?: Entry[];
  bills?: Bill[];
};

export type BillWithDetails = Bill & {
  customer: Customer;
  entries: Entry[];
};