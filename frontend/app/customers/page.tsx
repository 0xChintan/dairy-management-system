'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { customers } from '@/lib/data';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map(customer => (
          <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold">{customer.name}</h3>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        {customer.email}
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {customer.address}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-sm">
                    <p>Customer since: {new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No customers found</p>
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}