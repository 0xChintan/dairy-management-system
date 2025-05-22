import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, FileText, Plus, Trash2 } from 'lucide-react';
import { getCustomerById, getEntriesByCustomerId, calculateMonthlyTotal, customers } from '@/lib/data';
import { CustomerDetailClient } from './client';

export function generateStaticParams() {
  return customers.map((customer) => ({
    id: customer.id,
  }));
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customerId = params.id;
  const customer = getCustomerById(customerId);
  const entries = getEntriesByCustomerId(customerId);
  
  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Customer Not Found</h1>
        <p className="mb-6">The customer you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/customers">Back to Customers</Link>
        </Button>
      </div>
    );
  }

  // Calculate current month total
  const now = new Date();
  const currentMonthTotal = calculateMonthlyTotal(customerId, now.getMonth(), now.getFullYear());

  return <CustomerDetailClient customer={customer} entries={entries} currentMonthTotal={currentMonthTotal} />;
}