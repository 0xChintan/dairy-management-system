'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { entries, customers } from '@/lib/data';

export default function EntriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Join entries with customer data
  const entriesWithCustomer = entries.map(entry => {
    const customer = customers.find(c => c.id === entry.customerId);
    return { ...entry, customerName: customer?.name || 'Unknown' };
  });
  
  const filteredEntries = entriesWithCustomer.filter(entry => 
    entry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.product.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Milk Entries</h1>
          <p className="text-muted-foreground">Track milk deliveries for all customers</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/entries/new">
              <Plus className="mr-2 h-4 w-4" /> Add Entry
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map(entry => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Link 
                    href={`/customers/${entry.customerId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {entry.customerName}
                  </Link>
                </TableCell>
                <TableCell>{entry.product}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>${entry.pricePerUnit.toFixed(2)}</TableCell>
                <TableCell>
                  {entry.isPaid ? (
                    <Badge className="bg-green-500">Paid</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">${entry.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            
            {filteredEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}