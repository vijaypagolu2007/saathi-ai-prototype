
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SaathiIcon } from "@/components/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, BookHeart, Sparkles, Leaf, BarChart3, LogOut } from "lucide-react";
import React, { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/journal", label: "Journal", icon: BookHeart },
  { href: "/moods", label: "Moods", icon: BarChart3 },
  { href: "/resources", label: "Resources", icon: Sparkles },
  { href: "/tree", label: "My Tree", icon: Leaf },
];

function AppNavigation() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const router = useRouter();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };


  return (
    <>
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
              <span className={state === 'collapsed' ? 'hidden' : 'inline'}>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
    <div className="mt-auto">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: "Logout", side: "right" }}>
                    <LogOut />
                    <span className={state === 'collapsed' ? 'hidden' : 'inline'}>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </div>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state is not loading and there is no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // While the initial auth check is loading, show the custom loader
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-20 w-20 animate-beat text-primary/80"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </div>
    )
  }

  // If there's no user after loading, the useEffect will handle the redirect.
  // We can return null or a minimal layout to prevent flashing the main content.
  if (!user) {
    return null;
  }
  
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
