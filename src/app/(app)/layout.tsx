
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SaathiIcon } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, BookHeart, Sparkles, Leaf, BarChart3 } from "lucide-react";
import React from "react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/journal", label: "Journal", icon: BookHeart },
  { href: "/moods", label: "Moods", icon: BarChart3 },
  { href: "/resources", label: "Resources", icon: Sparkles },
  { href: "/tree", label: "My Tree", icon: Leaf },
];

function AppNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={
              pathname === item.href || (pathname === "/" && item.href === "/")
            }
            tooltip={{ children: item.label, side: "right" }}
          >
            <Link href={item.href} onClick={handleLinkClick}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <SaathiIcon className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">SaathiAI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <AppNavigation />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger>
            <SaathiIcon className="text-primary" />
          </SidebarTrigger>
          <div className="flex items-center gap-2">
            <SaathiIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-headline font-semibold">SaathiAI</h1>
          </div>
        </header>
        <main className="flex h-full flex-1 flex-col p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
