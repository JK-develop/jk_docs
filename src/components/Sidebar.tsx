"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "./Providers";
import { 
  Search, 
  BookOpen, 
  Layout, 
  Plus,
  X,
  Lock,
  BookOpen as FallbackIcon
} from "lucide-react";
import { DynamicIcon } from "./IconPicker";
import { useLanguage } from "./LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Sidebar({ categories = [] }: { categories?: any[] }) {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar } = useAppContext();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 glass-panel ${isRTL ? 'border-l' : 'border-r'} border-white/10
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header / Logo */}
          <div className="p-6 flex items-center justify-between flex-shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
              <div className="w-8 h-8 bg-[color:var(--accent-green)] rounded-lg flex items-center justify-center shadow-lg shadow-[color:rgba(163,230,53,0.25)]">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-app">
                JK <span className="accent-green">Docs</span>
              </span>
            </Link>
            <button className="lg:hidden text-muted hover:text-app transition-colors" onClick={toggleSidebar}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Primary CTA */}
          <div className="px-4 -mt-2 mb-4 flex-shrink-0">
            <Link
              href="/add"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-extrabold tracking-tight transition-all
                         bg-lime-500/10 dark:bg-lime-400/15 border border-lime-500/20 dark:border-lime-400/30 text-[color:var(--accent-green)]
                         hover:bg-lime-500/15 dark:hover:bg-lime-400/20 hover:border-lime-500/30 dark:hover:border-lime-400/40
                         hover:shadow-[0_0_22px_rgba(163,230,53,0.12)]"
            >
              <Plus className="w-5 h-5" />
              <span>{t("new_guide")}</span>
            </Link>
          </div>

          {/* Search Button (Visual) */}
          <div className="px-4 mb-6 flex-shrink-0">
            <button 
              className="w-full flex items-center justify-between gap-2 px-3 py-2 glass-input rounded-lg text-sm text-muted hover:border-white/20 hover:text-app transition-all group"
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
              }}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 group-hover:accent-green transition-colors" />
                <span>{t("search_placeholder").substring(0, 10)}...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 glass-input rounded text-[10px] font-sans">⌘K</kbd>
              </div>
            </button>
          </div>

          {/* Navigation & Categories */}
          <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5 custom-scrollbar">
            <div className="mb-2 px-2 py-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t("categories_label")}</p>
            </div>
            

            {categories.map((category) => {
              const isActive = pathname === '/' && currentCategory === category.name;
              
              return (
                <Link 
                  key={category.id}
                  href={`/?category=${encodeURIComponent(category.name)}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                    ${isActive 
                      ? 'bg-lime-500/10 dark:bg-lime-400/15 text-app border border-lime-500/20 dark:border-lime-400/30 font-semibold shadow-[0_0_15px_rgba(163,230,53,0.08)]' 
                      : 'text-muted hover:text-app hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <DynamicIcon 
                    name={category.icon} 
                    className={`w-4 h-4 transition-colors ${isActive ? 'accent-green' : 'group-hover:accent-green'}`} 
                    fallback={FallbackIcon}
                  />
                  <span className="text-sm">{isRTL && category.nameFa ? category.nameFa : category.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Area with Language Switcher */}
          <div className="p-4 border-t border-white/5 bg-white/2 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            
            <Link 
              href="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 text-muted-more hover:text-app transition-colors group"
            >
              <Lock className="w-3.5 h-3.5 group-hover:accent-green transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{t("admin_panel")}</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
