"use client";

import React from "react";
import { 
  Layers, Terminal, Database, Globe, Shield, Cpu, Layout, Wrench, 
  Book, Code, Settings, Server, Cloud, Smartphone, Monitor, Zap, 
  Lock, Key, Box, Package, GitBranch, Activity, BarChart, Folder, 
  FileText, Search, Menu, LucideIcon 
} from "lucide-react";

// Manual mapping to ensure production bundling works correctly
export const ICON_MAP: Record<string, LucideIcon> = {
  Layers, Terminal, Database, Globe, Shield, Cpu, Layout, Wrench, 
  Book, Code, Settings, Server, Cloud, Smartphone, Monitor, Zap, 
  Lock, Key, Box, Package, GitBranch, Activity, BarChart, Folder, 
  FileText, Search, Menu
};

export const AVAILABLE_ICONS = Object.entries(ICON_MAP).map(([name, icon]) => ({
  name,
  icon
}));

export function DynamicIcon({ name, className, fallback }: { name?: string | null, className?: string, fallback?: LucideIcon }) {
  if (!name || typeof name !== "string") {
    return fallback ? React.createElement(fallback, { className }) : null;
  }
  
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) {
    return fallback ? React.createElement(fallback, { className }) : null;
  }
  
  try {
    return React.createElement(IconComponent, { className });
  } catch (err) {
    return fallback ? React.createElement(fallback, { className }) : null;
  }
}

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 max-h-[300px] overflow-y-auto custom-scrollbar">
      {AVAILABLE_ICONS.map((item) => {
        const Icon = item.icon;
        const isActive = value === item.name;
        
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onChange(item.name)}
            className={`flex items-center justify-center p-3 rounded-xl transition-all hover:bg-white/10 ${
              isActive 
                ? "bg-lime-500/20 border border-lime-500/40 text-lime-400 scale-110 shadow-lg shadow-lime-500/10" 
                : "text-muted"
            }`}
            title={item.name}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}
    </div>
  );
}
