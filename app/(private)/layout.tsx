import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import React from 'react';
import { AppFooter } from '@/components/app-footer';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-screen min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-5 min-w-0 overflow-hidden">{children}</main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
