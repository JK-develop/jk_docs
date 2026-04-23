"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-0.5 p-0.5 glass-input rounded-lg border border-white/5 ${className}`}>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 text-[10px] font-black rounded-md transition-all ${
          language === "en" 
            ? "bg-lime-500 text-black shadow-sm" 
            : "text-muted hover:text-app"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("fa")}
        className={`px-2 py-1 text-[10px] font-black rounded-md transition-all ${
          language === "fa" 
            ? "bg-lime-500 text-black shadow-sm" 
            : "text-muted hover:text-app"
        }`}
      >
        FA
      </button>
    </div>
  );
}
