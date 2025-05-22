'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Entry } from '@/lib/types';

export default function EditEntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchEntry() {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error) {
        console.error('Error fetching entry:', error);
        return;
      }
      
      setEntry(data);
      setLoading(false);
    }
    
    fetchEntry();
  }, [params.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!entry) return;
    
    const { name, value } = e.target;
    
    if (name === 'quantity' || name === 'price_per_unit') {
      const numValue = parseFloat(value) || 0;
      const newEntry = {
        ...entry,
        [name]: numValue,
        amount: name === 'quantity' 
          ? numValue * entry.price_per_unit 
          : entry.quantity * numValue
      };
      setEntry(newEntry);
    } else {
      setEntry({ ...entry, [name]: value });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (!entry) return;
    setEntry({ ...entry, [name]: value });
  };

  const handlePaidChange = (checked: boolean) => {
    if (!entry) return;
    setEntry({
      ...entry,
      is_paid: checked,
      paid_on: checked ? new Date().toISOString() : null
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;
    
    try {
      const { error } = await supabase
        .from('entries')
        .update({
          date: entry.date,
          product: entry.product,
          quantity: entry.quantity,
          price_per_unit: entry.price_per_unit,
          amount: entry.amount,
          is_paid: entry.is_paid,
          paid_on: entry.paid_on
        })
        .eq('id', entry.id);
      
      if (error) throw error;
      
      router.push('/entries');
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!entry) {
    return <div>Entry not found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/entries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entries
          </Link>
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Entry</CardTitle>
          <CardDescription>Update milk delivery details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date"
                type="date"
                value={entry.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select 
                value={entry.product} 
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
                  value={entry.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price_per_unit">Price Per Unit</Label>
                <Input 
                  id="price_per_unit" 
                  name="price_per_unit"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={entry.price_per_unit}
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
                  value={entry.amount.toFixed(2)}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_paid"
                checked={entry.is_paid}
                onCheckedChange={handlePaidChange}
              />
              <Label htmlFor="is_paid">Mark as Paid</Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/entries')}>
              Cancel
            </Button>
            <Button type="submit">Update Entry</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}