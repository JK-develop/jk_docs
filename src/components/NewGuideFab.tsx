"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import React from "react";
import { useLanguage } from "./LanguageContext";

export function NewGuideFab() {
  const { isRTL, t } = useLanguage();
  
  return (
    <Link
      href="/add"
      className={`lg:hidden fixed bottom-5 ${isRTL ? 'left-5' : 'right-5'} z-50 h-14 w-14 rounded-2xl flex items-center justify-center
                 bg-[color:var(--accent-green-bright)] text-black shadow-[0_10px_30px_rgba(163,230,53,0.30)]
                 border border-white/20 dark:border-black/10
                 active:scale-95 transition-transform`}
      aria-label={t("new_guide")}
      title={t("new_guide")}
    >
      <Plus className="w-7 h-7" />
    </Link>
  );
}

