'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { customers } from '@/lib/data';

export default function NewEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get('customerId');
  
  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId || '',
    date: new Date().toISOString().split('T')[0],
    product: 'Whole Milk',
    quantity: 1,
    pricePerUnit: 1.50,
    amount: 1.50,
    isPaid: false,
    paidOn: undefined as Date | undefined
  });
  
  useEffect(() => {
    // Calculate amount whenever quantity or price changes
    const amount = formData.quantity * formData.pricePerUnit;
    setFormData(prev => ({ ...prev, amount }));
  }, [formData.quantity, formData.pricePerUnit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'quantity' || name === 'pricePerUnit') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaidChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPaid: checked,
      paidOn: checked ? new Date() : undefined
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this data to a database
    console.log('Form submitted:', formData);
    
    // Redirect to entries page or customer detail page
    if (preselectedCustomerId) {
      router.push(`/customers/${preselectedCustomerId}`);
    } else {
      router.push('/entries');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={preselectedCustomerId ? `/customers/${preselectedCustomerId}` : "/entries"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {preselectedCustomerId ? 'Customer' : 'Entries'}
          </Link>
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Entry</CardTitle>
          <CardDescription>Record a new milk delivery for a customer</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select 
                value={formData.customerId} 
                onValueChange={(value) => handleSelectChange('customerId', value)}
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
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select 
                value={formData.product} 
                onValueChange={(value) => handleSelectChange('product', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Whole Milk">Whole Milk</SelectItem>
                  <SelectItem value="Low-fat Milk">Low-fat Milk</SelectItem>
                  <SelectItem value="Skim Milk">Skim Milk</SelectItem>
                  <SelectItem value="Organic Milk">Organic Milk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price Per Unit</Label>
                <Input 
                  id="pricePerUnit" 
                  name="pricePerUnit"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount</Label>
                <Input 
                  id="amount" 
                  name="amount"
                  type="number"
                  value={formData.amount.toFixed(2)}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={handlePaidChange}
              />
              <Label htmlFor="isPaid">Mark as Paid</Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.push(preselectedCustomerId ? `/customers/${preselectedCustomerId}` : '/entries')}
            >
              Cancel
            </Button>
            <Button type="submit">Save Entry</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}