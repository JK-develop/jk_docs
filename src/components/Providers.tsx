"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = 'en';
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  }, [mounted]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const providerValue = { 
    isSidebarOpen, 
    setIsSidebarOpen,
    toggleSidebar,
    isSearchOpen,
    setIsSearchOpen
  };

  return (
    <AppContext.Provider value={providerValue}>
      <div 
        className="app-container ltr"
        style={!mounted ? { visibility: 'hidden' } : {}}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within Providers");
  return ctx;
}

