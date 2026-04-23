"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getGuides } from "@/lib/actions";
import { Search, Hash, Plus, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Guide = {
  id: number;
  slug: string;
  title: string;
  content: string;
  tags?: string | null;
  createdAt: any;
  updatedAt: any;
  categories: { id: number; slug: string; name: string; nameFa?: string | null }[];
};

function GuideGrid({ initialGuides }: { initialGuides: Guide[] }) {
  const { t, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [hasMore, setHasMore] = useState(initialGuides.length >= 9);
  const [loading, setLoading] = useState(false);

  // Reset guides when category changes
  useEffect(() => {
    setGuides(initialGuides);
    setHasMore(initialGuides.length >= 9);
  }, [initialGuides]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const skip = guides.length;
      // Find the active category ID from the filter
      const categoryId = initialGuides[0]?.categories?.find(c => c.slug === categoryFilter)?.id;
      
      const newGuides = await getGuides({ skip, take: 9, categoryId });
      if (newGuides.length < 9) {
        setHasMore(false);
      }
      setGuides((prev) => [...prev, ...newGuides]);
    } catch (error) {
      console.error("Failed to load more guides:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-app">
          {categoryFilter ? (
            <>
              {isRTL ? (
                <>کاوش در راهنماهای <span className="accent-green">{categoryFilter}</span></>
              ) : (
                <>Explore <span className="accent-green">{categoryFilter}</span> Guides</>
              )}
            </>
          ) : (
            <>
              {t("site_title").split(' ')[0]} <span className="accent-green">{t("site_title").split(' ').slice(1).join(' ')}</span>
            </>
          )}
        </h1>
        <p className="text-muted mt-3 text-sm md:text-base max-w-2xl">
          {categoryFilter 
            ? (isRTL ? `مستندات فنی تخصصی و جریان‌های کاری برای ${categoryFilter}.` : `Specialized technical documentation and workflows for ${categoryFilter}.`)
            : t("site_tagline")}
        </p>
      </div>

      {guides.length > 0 ? (
        <div className="space-y-12">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {guides.map((g, index) => (
              <Link
                key={g.id}
                href={`/guide/${g.slug}`}
                className={[
                  "glass-panel rounded-2xl p-5 md:p-6 block transition-all group",
                  "border border-white/10",
                  "hover:-translate-y-1",
                  "hover:border-lime-500/40",
                  "hover:shadow-[0_0_24px_rgba(163,230,53,0.1)]",
                ].join(" ")}
                style={{ animationDelay: `${(index % 6) * 0.05}s` }}
              >
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {g.categories?.map((c) => (
                    <span key={c.id} className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-lime-500/10 dark:bg-lime-400/12 border border-lime-500/20 dark:border-lime-400/20 accent-green">
                      {isRTL && c.nameFa ? c.nameFa : c.name}
                    </span>
                  )) ?? (
                    <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-muted">
                      General
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-app leading-snug mb-3 group-hover:accent-green transition-colors">
                  {g.title}
                </h2>

                {/* Content excerpt */}
                <p
                  className="text-sm text-muted leading-relaxed mb-6 line-clamp-2 h-10"
                >
                  {(g.content || "")
                    .replace(/[#*`>[\]]/g, "")
                    .substring(0, 150)
                    .trim()}
                </p>

                {/* Tags */}
                {g.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {g.tags.split(",").slice(0, 3).map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] text-muted-more bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        <Hash className="w-2.5 h-2.5 opacity-40 text-lime-500" />
                        {tag.trim()}
                      </span>
                    ))}
                    {g.tags.split(",").length > 3 && (
                      <span className="text-[10px] text-muted-more px-1">+ {g.tags.split(",").length - 3}</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </section>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-app font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin accent-green" />
                    <span>...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 accent-green" />
                    <span>{t("load_more")}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
          <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-app">{t("no_results")}</h3>
          <p className="text-muted mt-2">
            {categoryFilter
              ? t("try_other")
              : t("try_other")}
          </p>
        </div>
      )}
    </div>
  );
}

export function HomePageClient({ guides: initialGuides }: { guides: Guide[] }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin accent-green" />
      </div>
    }>
      <GuideGrid initialGuides={initialGuides} />
    </Suspense>
  );
}
