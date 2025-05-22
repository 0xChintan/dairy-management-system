'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Milk, Users, FileText, BarChart, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: BarChart,
      active: pathname === '/',
    },
    {
      href: '/customers',
      label: 'Customers',
      icon: Users,
      active: pathname.includes('/customers'),
    },
    {
      href: '/entries',
      label: 'Entries',
      icon: FileText,
      active: pathname.includes('/entries'),
    },
    {
      href: '/bills',
      label: 'Bills',
      icon: FileText,
      active: pathname.includes('/bills'),
    },
  ];
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center">
          <Milk className="mr-2 h-6 w-6" />
          <span className="font-bold text-xl hidden md:inline-block">Dairy Manager</span>
        </Link>
        
        <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                route.active 
                  ? "text-black dark:text-white" 
                  : "text-muted-foreground"
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
        
        <div className="ml-auto">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary flex items-center py-2",
                        route.active 
                          ? "text-black dark:text-white" 
                          : "text-muted-foreground"
                      )}
                    >
                      <route.icon className="mr-2 h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}