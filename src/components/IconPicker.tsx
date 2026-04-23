"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

// Curated list of high-quality icons for documentation categories
export const AVAILABLE_ICONS = [
  { name: "Layers", icon: LucideIcons.Layers },
  { name: "Terminal", icon: LucideIcons.Terminal },
  { name: "Database", icon: LucideIcons.Database },
  { name: "Globe", icon: LucideIcons.Globe },
  { name: "Shield", icon: LucideIcons.Shield },
  { name: "Cpu", icon: LucideIcons.Cpu },
  { name: "Layout", icon: LucideIcons.Layout },
  { name: "Wrench", icon: LucideIcons.Wrench },
  { name: "Book", icon: LucideIcons.Book },
  { name: "Code", icon: LucideIcons.Code },
  { name: "Settings", icon: LucideIcons.Settings },
  { name: "Server", icon: LucideIcons.Server },
  { name: "Cloud", icon: LucideIcons.Cloud },
  { name: "Smartphone", icon: LucideIcons.Smartphone },
  { name: "Monitor", icon: LucideIcons.Monitor },
  { name: "Zap", icon: LucideIcons.Zap },
  { name: "Lock", icon: LucideIcons.Lock },
  { name: "Key", icon: LucideIcons.Key },
  { name: "Box", icon: LucideIcons.Box },
  { name: "Package", icon: LucideIcons.Package },
  { name: "Github", icon: LucideIcons.Github },
  { name: "Infinity", icon: LucideIcons.Infinity },
  { name: "Network", icon: LucideIcons.Network },
  { name: "HardDrive", icon: LucideIcons.HardDrive },
  { name: "Activity", icon: LucideIcons.Activity },
  { name: "BarChart", icon: LucideIcons.BarChart },
  { name: "Folder", icon: LucideIcons.Folder },
  { name: "FileText", icon: LucideIcons.FileText },
  { name: "Search", icon: LucideIcons.Search },
  { name: "Menu", icon: LucideIcons.Menu },
];

export function DynamicIcon({ name, className, fallback }: { name?: string | null, className?: string, fallback?: LucideIcon }) {
  if (!name || typeof name !== "string") {
    return fallback ? React.createElement(fallback, { className }) : null;
  }
  
  const IconComponent = (LucideIcons as any)[name];
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
