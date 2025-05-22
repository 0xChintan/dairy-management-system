'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, FileSpreadsheet, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { updateBillPaymentStatus } from '@/lib/supabase';

// BackButton component for reuse
function BackButton() {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/bills">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bills
      </Link>
    </Button>
  );
}

export default function BillDetail({ bill, customer, entries }) {
  const invoiceRef = useRef(null);
  
  // Create bill date ranges
  const startDate = new Date(bill.year, bill.monthNumber, 1);
  const endDate = new Date(bill.year, bill.monthNumber + 1, 0);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`invoice-${bill.id}.pdf`);
  };
  
  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Create invoice details worksheet
    const invoiceDetails = [
      ['Invoice Details'],
      ['Bill Number', bill.id],
      ['Customer Name', customer.name],
      ['Customer Address', customer.address],
      ['Customer Phone', customer.phone],
      ['Customer Email', customer.email || 'N/A'],
      ['Bill Period', `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`],
      ['Status', bill.isPaid ? 'Paid' : 'Unpaid'],
      ['Total Amount', `$${bill.totalAmount.toFixed(2)}`],
      [],
      ['Entries'],
      ['Date', 'Product', 'Quantity', 'Price', 'Amount']
    ];
    
    // Add entries to worksheet
    entries.forEach(entry => {
      invoiceDetails.push([
        format(new Date(entry.date), 'MMM d, yyyy'),
        entry.product,
        entry.quantity,
        `$${entry.pricePerUnit.toFixed(2)}`,
        `$${entry.amount.toFixed(2)}`
      ]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(invoiceDetails);
    XLSX.utils.book_append_sheet(workbook, ws, 'Invoice');
    
    // Save the file
    XLSX.writeFile(workbook, `invoice-${bill.id}.xlsx`);
  };

  const handlePaymentStatusChange = async () => {
    try {
      await updateBillPaymentStatus(bill.id, !bill.isPaid);
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Invoice</h1>
          <p className="text-muted-foreground">Bill #{bill.id}</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button
            variant={bill.isPaid ? "destructive" : "default"}
            size="sm"
            onClick={handlePaymentStatusChange}
          >
            Mark as {bill.isPaid ? 'Unpaid' : 'Paid'}
          </Button>
        </div>
      </div>
      
      <div ref={invoiceRef} className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-8 mb-8 print:shadow-none">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Dairy Manager</h2>
            <p className="text-muted-foreground">123 Dairy Road</p>
            <p className="text-muted-foreground">Milkville, CA 90210</p>
            <p className="text-muted-foreground">contact@dairymanager.com</p>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          
          <div className="mt-6 md:mt-0 md:text-right">
            <p className="text-muted-foreground">Bill To:</p>
            <h3 className="text-lg font-semibold">{customer?.name}</h3>
            <p>{customer?.address}</p>
            <p>{customer?.phone}</p>
            {customer?.email && <p>{customer?.email}</p>}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <p className="text-muted-foreground">Bill Period:</p>
            <p className="font-medium">
              {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-muted-foreground">Invoice Date:</p>
            <p className="font-medium">{format(new Date(bill.createdAt), 'MMMM d, yyyy')}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-muted-foreground">Status:</p>
            <p className={`font-medium ${bill.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
              {bill.isPaid ? 'Paid' : 'Unpaid'}
            </p>
            {bill.isPaid && bill.paidOn && (
              <p className="text-sm text-muted-foreground">
                Paid on {format(new Date(bill.paidOn), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
        
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
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{entry.product}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>${entry.pricePerUnit.toFixed(2)}</TableCell>
                <TableCell className="text-right">${entry.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-8 md:w-1/2 ml-auto">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${bill.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (0%):</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${bill.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4 text-center text-muted-foreground">
          <p>Thank you for your business!</p>
          <p className="mt-1">For questions concerning this invoice, please contact customer support.</p>
        </div>
      </div>
    </div>
  );
}

// Export BackButton for reuse
BillDetail.BackButton = BackButton;