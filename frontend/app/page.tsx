'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Users, FileText, Plus } from 'lucide-react';
import { customers, entries } from '@/lib/data';

export default function Dashboard() {
  // Calculate some basic stats
  const totalCustomers = customers.length;
  const totalEntries = entries.length;
  const totalSales = entries.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Get today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your dairy business</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/entries/new">
              <Plus className="mr-2 h-4 w-4" /> Add Entry
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEntries.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>Recently added customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).map(customer => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/customers/${customer.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/customers">View All Customers</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Latest milk deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.slice(0, 5).map(entry => {
                const customer = customers.find(c => c.id === entry.customerId);
                return (
                  <div key={entry.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()} - {entry.quantity} × {entry.product}
                      </p>
                    </div>
                    <p className="font-medium">${entry.amount.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/entries">View All Entries</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}