"use client";

import React from "react";
import { Menu, Search, Moon, Sun } from "lucide-react";
import { useAppContext } from "./Providers";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ categories = [] }: { categories?: any[] }) {
  const { toggleSidebar } = useAppContext();

  return (
    <header className="sticky top-0 z-30 w-full flex-none glass-panel border-b border-white/10 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-muted hover:text-app lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-app">
              JK <span className="accent-green">Docs</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <button 
            className="p-1.5 text-muted hover:text-app"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

