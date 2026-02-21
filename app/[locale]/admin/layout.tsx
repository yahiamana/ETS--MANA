"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Users, 
  LogOut, 
  Settings,
  Menu,
  X,
  FileText
} from "lucide-react";
import { useState, use } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { name: "Jobs", href: "/admin/recruitment", icon: FileText },
  { name: "Quote Requests", href: "/admin/quotes", icon: MessageSquare },
  { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Applications", href: "/admin/applications", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Don't show layout on login page
  if (pathname === `/${locale}/admin/login` || pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-primary text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className={cn("flex items-center space-x-2 transition-opacity", !sidebarOpen && "opacity-0")}>
            <span className="text-xl font-black tracking-tighter">MANA</span>
            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-secondary-foreground/60 hover:text-white">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-grow mt-10 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const localizedHref = `/${locale}${link.href}`;
            const isActive = pathname === localizedHref;
            return (
              <Link
                key={link.name}
                href={localizedHref}
                className={cn(
                  "flex items-center p-4 transition-colors group",
                  isActive 
                    ? "bg-accent text-white" 
                    : "text-secondary-foreground/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <link.icon className={cn("w-5 h-5 shrink-0", sidebarOpen && "mr-4")} />
                {sidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-4 text-secondary-foreground/60 hover:text-red-400 transition-colors"
          >
            <LogOut className={cn("w-5 h-5 shrink-0", sidebarOpen && "mr-4")} />
            {sidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
