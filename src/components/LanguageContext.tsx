"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLanguage = "en" }: { children: React.ReactNode; initialLanguage?: Language }) {
  const [language, setLangState] = useState<Language>(initialLanguage);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000`; // 1 year
    // Update HTML attributes for immediate feedback
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    
    // Refresh the page to ensure all server components re-fetch data for the new language
    window.location.reload();
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || key;
  };

  const isRTL = language === "fa";

  useEffect(() => {
    // Sync attributes on mount
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
