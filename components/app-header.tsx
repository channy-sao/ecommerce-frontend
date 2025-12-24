"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavUser } from '@/components/nav-user';
import * as React from 'react';
import { Notification } from '@/components/notification';

export function AppHeader() {
  const pathname = usePathname();

  // Remove empty segments → ["dashboard", "products", "123"]
  const segments = pathname.split("/").filter((seg) => seg.length > 0);

  // Helper: capitalize
  const format = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <header className="sticky top-0 z-50 bg-sidebar flex h-16 items-center justify-between px-4 gap-2 border-b border-gray-100 dark:border-gray-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:cursor-pointer hover:bg-sidebar-menu  hover:bg-[rgba(255,255,255,0)]border-[0.3px] rounded-sm" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />


        <Breadcrumb>
          <BreadcrumbList>
            {/* Dynamic breadcrumb generation */}
            {segments.map((seg, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;

              return (
                <React.Fragment key={href}>
                  <BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbLink href={href}>{format(seg)}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{format(seg)}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {/* Add separator after each item except the last one */}
                  {!isLast && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3.5">
        <Notification/>
        <ModeToggle />
        <NavUser />
      </div>
    </header>
  );
}
