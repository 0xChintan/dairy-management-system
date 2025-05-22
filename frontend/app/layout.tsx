import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/nav-bar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dairy Manager - Customer Management System',
  description: 'Manage dairy customers, track milk deliveries, and generate bills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <NavBar />
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </body>
    </html>
  );
}