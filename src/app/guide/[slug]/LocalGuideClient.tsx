"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadLocalGuides, onGuidesUpdated, type LocalGuide } from "@/lib/localGuides";
import { useLanguage } from "@/components/LanguageContext";

export function LocalGuideClient({ slug }: { slug: string }) {
  const { isRTL } = useLanguage();
  const [guides, setGuides] = useState<LocalGuide[]>([]);

  useEffect(() => {
    setGuides(loadLocalGuides());
    return onGuidesUpdated(() => setGuides(loadLocalGuides()));
  }, []);

  const guide = useMemo(() => guides.find((g) => g.slug === slug), [guides, slug]);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-6">
        <h1 className="text-xl font-extrabold text-app mb-2">Guide not found</h1>
        <p className="text-muted">
          This guide isn’t available in local storage on this device.
        </p>
        <div className="mt-4">
          <Link href="/" className="accent-green font-bold">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {(guide.categories || (guide.category ? [guide.category] : [])).map((c: any) => (
            <span key={c.name} className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase bg-[color:rgba(163,230,53,0.12)] border border-[color:rgba(163,230,53,0.25)] accent-green">
              {isRTL && c.nameFa ? c.nameFa : c.name}
            </span>
          ))}
          {!(guide.categories || guide.category) && (
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase bg-[color:rgba(163,230,53,0.12)] border border-[color:rgba(163,230,53,0.25)] accent-green">
              General
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-gray-100 mb-4">
          {guide.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {(guide.tags || []).map((t) => (
            <span
              key={t}
              className="text-[11px] px-2.5 py-1 rounded-lg glass-input border border-white/10 text-slate-800 dark:text-gray-200"
            >
              {t}
            </span>
          ))}
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm text-slate-800 dark:text-gray-200 leading-relaxed font-mono glass-input rounded-2xl p-4 border border-white/10">
          {guide.content}
        </pre>
      </div>
    </div>
  );
}

