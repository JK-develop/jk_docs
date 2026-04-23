"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "./Providers";
import { Search, X, Book, FileText, ChevronRight, Hash, Clock } from "lucide-react";
import { searchGuides } from "@/lib/actions";
import { DynamicIcon } from "./IconPicker";
import { useLanguage } from "./LanguageContext";

export function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen } = useAppContext();
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Search when query changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const searchResults = await searchGuides(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      const timeoutId = setTimeout(fetchResults, 200); // Simple debounce
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const displayResults = useMemo(() => {
    return results.map((g) => {
      const cat = g.categories?.[0];
      const catName = isRTL && cat?.nameFa ? cat.nameFa : (cat?.name || "General");
      
      return {
        id: g.id,
        title: g.title,
        category: catName,
        icon: cat?.icon,
        section: g.categories?.length > 1 ? `+${g.categories.length - 1} more` : "Docs",
        tags: g.tags ? g.tags.split(",").map((t: string) => t.trim()) : [],
        slug: g.slug,
      };
    });
  }, [results, isRTL]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      if (!isSearchOpen) return;

      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
      
      if (displayResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % displayResults.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + displayResults.length) % displayResults.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleSelect(displayResults[selectedIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, displayResults, selectedIndex]);

  const handleSearch = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleSelect = (guide: any) => {
    router.push(`/guide/${guide.slug}`);
    setIsSearchOpen(false);
  };

  if (!isSearchOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" 
        onClick={() => setIsSearchOpen(false)}
      />

      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl glass-panel glass-panel-strong shadow-[0_0_50px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 transition-all animate-in zoom-in-95 slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 md:px-5 border-b border-white/5">
          <Search className={`w-5 h-5 accent-green ${isRTL ? 'ml-0 mr-1' : ''}`} />
          <input
            ref={inputRef}
            type="text"
            className="w-full h-14 md:h-16 px-4 bg-transparent text-app placeholder-[color:var(--muted)] text-base outline-none"
            placeholder={t("search_placeholder")}
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="md:hidden p-2 text-muted hover:text-app glass-input rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 glass-input rounded text-[10px] font-sans text-muted">ESC</kbd>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] md:max-h-[50vh] overflow-y-auto p-2 md:p-3 custom-scrollbar">
          {displayResults.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  {query ? t("search_results") : t("site_tagline")}
                </p>
                {!query && <Clock className="w-3 h-3 text-slate-500" />}
              </div>
              
              {displayResults.map((r, i) => (
                <button
                  key={r.id}
                  className={`
                    w-full flex flex-col gap-1 px-4 py-3 rounded-xl transition-all text-start group
                    ${i === selectedIndex 
                      ? 'bg-lime-500/10 dark:bg-lime-400/15 ring-1 ring-lime-500/30 dark:ring-lime-400/40 shadow-[0_0_22px_rgba(163,230,53,0.12)]' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 bg-transparent ring-1 ring-transparent'}
                  `}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => handleSelect(r)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                        ${i === selectedIndex ? 'bg-[color:var(--accent-green)] text-white dark:text-black' : 'glass-input text-muted'}
                      `}>
                        <DynamicIcon name={r.icon} className="w-5 h-5" fallback={FileText} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                            {r.category}
                            <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                            {r.section || "General"}
                          </span>
                        </div>
                        <p className="text-sm md:text-base font-semibold truncate text-app">
                          {r.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="text-center py-20">
              <Book className="w-16 h-16 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-700 dark:text-slate-400 text-lg">
                {t("no_results")} {" "}
                <span className="text-slate-900 dark:text-gray-100 font-medium">"{query}"</span>
              </p>
              <p className="text-slate-600 dark:text-slate-500 text-sm mt-2">
                {t("try_other")}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer shortcuts */}
        <div className="hidden md:flex items-center gap-6 px-5 py-3 border-t border-white/5 bg-white/5 text-muted text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="glass-input px-1.5 py-0.5 rounded text-app">↑↓</span>
            <span>{isRTL ? 'برای جابجایی' : 'to navigate'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="glass-input px-1.5 py-0.5 rounded text-app">Enter</span>
            <span>{isRTL ? 'برای انتخاب' : 'to select'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="glass-input px-1.5 py-0.5 rounded text-app">Esc</span>
            <span>{isRTL ? 'برای بستن' : 'to close'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
