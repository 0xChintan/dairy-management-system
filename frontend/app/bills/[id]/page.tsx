import BillDetail from '@/components/bill-detail';
import { getCustomerById, getEntriesByCustomerId } from '@/lib/data';

// Sample bills data - in a real app this would come from a database
const bills = [
  {
    id: '1',
    customerId: '1',
    month: 'March',
    monthNumber: 2,
    year: 2023,
    totalAmount: 93.00,
    isPaid: true,
    paidOn: new Date('2023-04-05'),
    createdAt: new Date('2023-04-01')
  },
  {
    id: '2',
    customerId: '2',
    month: 'March',
    monthNumber: 2,
    year: 2023,
    totalAmount: 54.25,
    isPaid: false,
    createdAt: new Date('2023-04-01')
  },
  {
    id: '3',
    customerId: '3',
    month: 'March',
    monthNumber: 2,
    year: 2023,
    totalAmount: 139.50,
    isPaid: true,
    paidOn: new Date('2023-04-03'),
    createdAt: new Date('2023-04-01')
  }
];

export function generateStaticParams() {
  return bills.map((bill) => ({
    id: bill.id,
  }));
}

export default function BillDetailPage({ params }: { params: { id: string } }) {
  const billId = params.id;
  const bill = bills.find(b => b.id === billId);
  
  if (!bill) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Bill Not Found</h1>
        <p className="mb-6">The bill you're looking for doesn't exist.</p>
        <BillDetail.BackButton />
      </div>
    );
  }
  
  const customer = getCustomerById(bill.customerId);
  const entries = getEntriesByCustomerId(bill.customerId).filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === bill.monthNumber && entryDate.getFullYear() === bill.year;
  });

  return <BillDetail bill={bill} customer={customer} entries={entries} />;
}