'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, FileText, Plus, Trash2 } from 'lucide-react';
import type { Customer, Entry } from '@/lib/types';

interface CustomerDetailClientProps {
  customer: Customer;
  entries: Entry[];
  currentMonthTotal: number;
}

export function CustomerDetailClient({ customer, entries, currentMonthTotal }: CustomerDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">Customer since {format(new Date(customer.createdAt), 'MMM d, yyyy')}</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href={`/customers/${customer.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{customer.phone}</p>
            {customer.email && <p className="text-muted-foreground">{customer.email}</p>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.address}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Month Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${currentMonthTotal.toFixed(2)}</p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href={`/bills/generate?customerId=${customer.id}`}>
                <FileText className="mr-2 h-4 w-4" /> Generate Bill
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="details">Customer Details</TabsTrigger>
          <TabsTrigger value="entries">Milk Entries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Complete details about {customer.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                  <dd className="mt-1">{customer.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd className="mt-1">{customer.phone}</dd>
                </div>
                {customer.email && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="mt-1">{customer.email}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                  <dd className="mt-1">{customer.address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Customer Since</dt>
                  <dd className="mt-1">{format(new Date(customer.createdAt), 'MMMM d, yyyy')}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="entries" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Milk Entries</CardTitle>
                <CardDescription>History of milk deliveries for {customer.name}</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href={`/entries/new?customerId=${customer.id}`}>
                  <Plus className="mr-2 h-4 w-4" /> Add Entry
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {entries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{entry.product}</TableCell>
                        <TableCell>{entry.quantity}</TableCell>
                        <TableCell>${entry.pricePerUnit.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${entry.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No entries found for this customer</p>
                  <Button asChild size="sm">
                    <Link href={`/entries/new?customerId=${customer.id}`}>
                      <Plus className="mr-2 h-4 w-4" /> Add First Entry
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}