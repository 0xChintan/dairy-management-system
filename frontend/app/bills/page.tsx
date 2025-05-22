'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, Plus, Search } from 'lucide-react';
import { customers } from '@/lib/data';

// Sample bills data
const bills = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    month: 'March',
    year: 2023,
    totalAmount: 93.00,
    isPaid: true,
    paidOn: new Date('2023-04-05'),
    createdAt: new Date('2023-04-01')
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Jane Smith',
    month: 'March',
    year: 2023,
    totalAmount: 54.25,
    isPaid: false,
    createdAt: new Date('2023-04-01')
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Robert Johnson',
    month: 'March',
    year: 2023,
    totalAmount: 139.50,
    isPaid: true,
    paidOn: new Date('2023-04-03'),
    createdAt: new Date('2023-04-01')
  }
];

export default function BillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBills = bills.filter(bill => 
    bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${bill.month} ${bill.year}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">Generate and manage monthly bills</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/bills/generate">
              <Plus className="mr-2 h-4 w-4" /> Generate Bill
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bills.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bills.filter(bill => bill.isPaid).length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bills.filter(bill => !bill.isPaid).length}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Generated On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map(bill => (
              <TableRow key={bill.id}>
                <TableCell>
                  <Link 
                    href={`/customers/${bill.customerId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {bill.customerName}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {bill.month} {bill.year}
                  </div>
                </TableCell>
                <TableCell className="font-medium">${bill.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  {bill.isPaid ? (
                    <Badge className="bg-green-500">Paid</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{bill.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/bills/${bill.id}`}>
                        <FileText className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredBills.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}