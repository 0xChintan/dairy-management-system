'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import type { Customer, Entry } from '@/lib/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function GenerateBillPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get('customerId');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedCustomerId || '');
  const [previewEntries, setPreviewEntries] = useState<Entry[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    async function fetchCustomers() {
      const { data } = await supabase.from('customers').select('*').order('name');
      if (data) setCustomers(data);
    }
    fetchCustomers();
  }, []);
  
  // Generate month options
  const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];
  
  // Generate year options (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const years = [
    { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: currentYear.toString(), label: currentYear.toString() },
  ];
  
  // Update preview when customer, month or year changes
  useEffect(() => {
    async function fetchEntries() {
      if (!selectedCustomerId) return;
      
      const monthInt = parseInt(selectedMonth, 10);
      const yearInt = parseInt(selectedYear, 10);
      
      const startDate = new Date(yearInt, monthInt, 1).toISOString();
      const endDate = new Date(yearInt, monthInt + 1, 0).toISOString();
      
      const { data: entries } = await supabase
        .from('entries')
        .select('*')
        .eq('customer_id', selectedCustomerId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');
      
      if (entries) {
        setPreviewEntries(entries);
        setTotalAmount(entries.reduce((sum, entry) => sum + entry.amount, 0));
      }
    }
    
    fetchEntries();
  }, [selectedCustomerId, selectedMonth, selectedYear]);
  
  const handleGenerateBill = async () => {
    if (!selectedCustomerId || previewEntries.length === 0) return;
    
    try {
      const { data: bill, error } = await supabase
        .from('bills')
        .insert({
          customer_id: selectedCustomerId,
          month: parseInt(selectedMonth, 10) + 1,
          year: parseInt(selectedYear, 10),
          total_amount: totalAmount,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      router.push(`/bills/${bill.id}`);
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPDF = async () => {
    const element = document.getElementById('bill-preview');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`bill-${selectedCustomerId}-${selectedMonth}-${selectedYear}.pdf`);
  };
  
  const handleDownloadExcel = () => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const selectedMonthName = months.find(m => m.value === selectedMonth)?.label;
    
    const workbook = XLSX.utils.book_new();
    
    const data = [
      ['Bill Details'],
      ['Customer Name', selectedCustomer?.name],
      ['Period', `${selectedMonthName} ${selectedYear}`],
      ['Total Amount', `$${totalAmount.toFixed(2)}`],
      [],
      ['Date', 'Product', 'Quantity', 'Price', 'Amount']
    ];
    
    previewEntries.forEach(entry => {
      data.push([
        format(new Date(entry.date), 'MMM d, yyyy'),
        entry.product,
        entry.quantity,
        `$${entry.price_per_unit.toFixed(2)}`,
        `$${entry.amount.toFixed(2)}`
      ]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws, 'Bill');
    XLSX.writeFile(workbook, `bill-${selectedCustomerId}-${selectedMonth}-${selectedYear}.xlsx`);
  };
  
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedMonthName = months.find(m => m.value === selectedMonth)?.label;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/bills">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bills
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate Monthly Bill</CardTitle>
          <CardDescription>Create a bill for a customer's monthly milk purchases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select 
                value={selectedCustomerId} 
                onValueChange={setSelectedCustomerId}
                disabled={!!preselectedCustomerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedCustomerId && (
        <Card>
          <CardHeader>
            <CardTitle>Bill Preview</CardTitle>
            <CardDescription>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedMonthName} {selectedYear} - {selectedCustomer?.name}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id="bill-preview">
              {previewEntries.length > 0 ? (
                <>
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
                      {previewEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{entry.product}</TableCell>
                          <TableCell>{entry.quantity}</TableCell>
                          <TableCell>${entry.price_per_unit.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${entry.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">${totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground mb-2">Customer Information</p>
                    <p className="font-medium">{selectedCustomer?.name}</p>
                    <p>{selectedCustomer?.address}</p>
                    <p>{selectedCustomer?.phone}</p>
                    {selectedCustomer?.email && <p>{selectedCustomer.email}</p>}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No entries found for {selectedCustomer?.name} in {selectedMonthName} {selectedYear}.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/bills">Cancel</Link>
            </Button>
            <div className="space-x-2">
              <Button 
                variant="outline"
                onClick={handlePrint}
                disabled={previewEntries.length === 0}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline"
                onClick={handleDownloadPDF}
                disabled={previewEntries.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button 
                variant="outline"
                onClick={handleDownloadExcel}
                disabled={previewEntries.length === 0}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button 
                onClick={handleGenerateBill}
                disabled={previewEntries.length === 0}
              >
                Generate Bill
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}