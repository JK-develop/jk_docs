"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "./Providers";
import { withDefaultCategories } from "@/lib/defaultCategories";
import { loadLocalCategories, onCategoriesUpdated, type CategoryIconKey } from "@/lib/localCategories";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Layout, 
  Terminal, 
  Cpu, 
  Plus,
  Moon,
  Sun,
  Database,
  Server,
  Code2,
  Globe,
  X,
  Shield,
  Wrench,
  Palette
} from "lucide-react";

export function Sidebar({ categories = [] }: { categories?: any[] }) {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar } = useAppContext();
  const [localCategories, setLocalCategories] = useState<{ id: string; name: string; iconKey: CategoryIconKey }[]>([]);
  
  const allCategories = useMemo(() => {
    const base = withDefaultCategories(categories);
    const merged = [...base];
    for (const c of localCategories) {
      if (!merged.some((m: any) => (m?.name || "").toLowerCase() === c.name.toLowerCase())) {
        merged.push({ id: c.id, name: c.name, guides: [], iconKey: c.iconKey });
      }
    }
    return merged;
  }, [categories, localCategories]);

  useEffect(() => {
    setLocalCategories(loadLocalCategories());
    return onCategoriesUpdated(() => setLocalCategories(loadLocalCategories()));
  }, []);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Initialize all to expanded
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    allCategories.forEach(cat => {
      initial[cat.id] = true;
    });
    setExpandedCategories(initial);
  }, [allCategories]);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (name: string, iconKey?: CategoryIconKey) => {
    if (iconKey === "database") return Database;
    if (iconKey === "server") return Server;
    if (iconKey === "code") return Code2;
    if (iconKey === "globe") return Globe;
    if (iconKey === "terminal") return Terminal;
    if (iconKey === "cpu") return Cpu;

    if (name.includes("Frontend")) return Layout;
    if (name.includes("Backend")) return Terminal;
    if (name.includes("DevOps")) return Cpu;
    if (name.includes("Database")) return Database;
    if (name.includes("Security")) return Shield;
    if (name.includes("Tools")) return Wrench;
    if (name.includes("Design")) return Palette;
    return BookOpen;
  };

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
        fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
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
              <span>New Guide</span>
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
                <span>Search...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 glass-input rounded text-[10px] font-sans">⌘K</kbd>
              </div>
            </button>
          </div>

          {/* Navigation Tree */}
          <nav className="flex-1 overflow-y-auto px-2 pb-6 custom-scrollbar">
            {allCategories.map((category) => {
              const Icon = getIcon(category.name, (category as any).iconKey);
              const isExpanded = expandedCategories[category.id] !== false;
              
              return (
                <div key={category.id} className="mb-1">
                  <div className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-app transition-colors group text-left">
                    <Link 
                      href={`/?category=${encodeURIComponent(category.name)}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-2 flex-grow"
                    >
                      <Icon className="w-4 h-4 text-muted group-hover:accent-green transition-colors" />
                      <span>{category.name}</span>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCategory(category.id);
                      }} 
                      className="p-1 px-2 -mr-2"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className={`mt-1 ml-4 border-l border-white/10 space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {category.guides?.map((guide: any) => {
                      const href = guide.slug.startsWith('/') ? guide.slug : `/guide/${guide.slug}`;
                      const isActive = pathname === href;
                      
                      return (
                        <Link 
                          key={guide.id}
                          href={href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`
                            block px-4 py-1.5 text-sm rounded-r-md transition-all
                            ${isActive 
                              ? 'accent-green bg-lime-500/5 dark:bg-lime-400/10 border-l-2 border-[color:var(--accent-green)] font-semibold' 
                              : 'text-muted hover:text-app hover:bg-black/5 dark:hover:bg-white/5'}
                          `}
                        >
                          {guide.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
