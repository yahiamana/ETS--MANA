"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <div className="flex bg-muted rounded-full p-1 border border-border">
      {[
        { id: "light", icon: Sun },
        { id: "dark", icon: Moon },
        { id: "system", icon: Monitor },
      ].map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={cn(
            "w-8 h-8 flex items-center justify-center transition-all rounded-full",
            theme === id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-secondary hover:text-foreground"
          )}
          title={`Switch to ${id} theme`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
