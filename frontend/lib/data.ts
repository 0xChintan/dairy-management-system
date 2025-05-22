import { Customer, Entry } from './types';

// Sample customer data
export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    address: '123 Main St, Anytown',
    phone: '555-123-4567',
    email: 'john@example.com',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    address: '456 Oak Ave, Somewhere',
    phone: '555-987-6543',
    email: 'jane@example.com',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Robert Johnson',
    address: '789 Pine Rd, Nowhere',
    phone: '555-456-7890',
    createdAt: new Date('2023-03-10'),
  },
];

// Sample entry data
export const entries: Entry[] = [
  {
    id: '1',
    customerId: '1',
    date: new Date('2023-04-01'),
    product: 'Whole Milk',
    quantity: 2,
    pricePerUnit: 1.5,
    amount: 3,
    isPaid: true,
    paidOn: new Date('2023-04-01'),
  },
  {
    id: '2',
    customerId: '1',
    date: new Date('2023-04-02'),
    product: 'Whole Milk',
    quantity: 2,
    pricePerUnit: 1.5,
    amount: 3,
    isPaid: false,
  },
  {
    id: '3',
    customerId: '2',
    date: new Date('2023-04-01'),
    product: 'Low-fat Milk',
    quantity: 1,
    pricePerUnit: 1.75,
    amount: 1.75,
    isPaid: true,
    paidOn: new Date('2023-04-01'),
  },
  {
    id: '4',
    customerId: '3',
    date: new Date('2023-04-01'),
    product: 'Whole Milk',
    quantity: 3,
    pricePerUnit: 1.5,
    amount: 4.5,
    isPaid: false,
  },
  {
    id: '5',
    customerId: '3',
    date: new Date('2023-04-02'),
    product: 'Whole Milk',
    quantity: 3,
    pricePerUnit: 1.5,
    amount: 4.5,
    isPaid: true,
    paidOn: new Date('2023-04-02'),
  },
];

// Helper function to get entries for a specific customer
export function getEntriesByCustomerId(customerId: string): Entry[] {
  return entries.filter(entry => entry.customerId === customerId);
}

// Helper function to get customer by ID
export function getCustomerById(id: string): Customer | undefined {
  return customers.find(customer => customer.id === id);
}

// Helper function to calculate total for a month
export function calculateMonthlyTotal(customerId: string, month: number, year: number): number {
  const customerEntries = getEntriesByCustomerId(customerId);
  
  const monthlyEntries = customerEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
  });
  
  return monthlyEntries.reduce((total, entry) => total + entry.amount, 0);
}