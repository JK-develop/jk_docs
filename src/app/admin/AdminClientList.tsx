"use client";

import { deleteGuide, deleteCategory } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, FileText, ChevronRight, Hash, Layers } from "lucide-react";
import { DynamicIcon } from "@/components/IconPicker";
import { useLanguage } from "@/components/LanguageContext";

export function AdminClientList({ categories }: { categories: any[] }) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const handleDeleteGuide = async (id: number) => {
    if (confirm(t("delete_guide") + "?")) {
      await deleteGuide(id);
      router.refresh();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm(t("delete_category") + "?")) {
      try {
        await deleteCategory(id);
        router.refresh();
      } catch (err) {
        alert("Could not delete category. Make sure it's empty first.");
      }
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {categories.map((cat: any) => (
        <div key={cat.id} className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Category Header */}
          <div className="p-6 md:p-8 bg-white/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-lime-500/10 flex items-center justify-center border border-lime-500/20 shadow-[0_0_20px_rgba(163,230,53,0.1)]">
                <DynamicIcon name={cat.icon} className="w-6 h-6 accent-green" fallback={Layers} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-app">{isRTL && cat.nameFa ? cat.nameFa : cat.name}</h3>
                <p className="text-muted text-sm tracking-tight opacity-70">/{cat.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                {cat.guides.length} {t("total_guides").split(' ')[1]}
              </span>
              <div className="flex items-center gap-1">
                <Link 
                  href={`/admin/category?id=${cat.id}`}
                  className="p-2 rounded-lg text-muted hover:text-app hover:bg-white/10 transition-all"
                  title={t("edit_category")}
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title={t("delete_category")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Guides Table/List */}
          <div className="p-2 md:p-4">
            {cat.guides.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-10" />
                <p>{t("no_guides_category")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                      <th className="px-6 py-3 text-start">{t("title_slug")}</th>
                      <th className="px-6 py-3 text-start">{t("last_updated")}</th>
                      <th className={`px-6 py-3 ${isRTL ? 'text-start' : 'text-end'}`}>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.guides.map((guide: any) => (
                      <tr key={guide.id} className="group bg-white/2 hover:bg-white/5 transition-all transition-colors duration-300">
                        <td className={`px-6 py-4 ${isRTL ? 'rounded-r-2xl' : 'rounded-l-2xl'}`}>
                          <div className="flex flex-col">
                            <span className="text-app font-bold group-hover:accent-green transition-colors">{guide.title}</span>
                            <span className="text-xs text-muted-more font-mono opacity-50">{guide.slug}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">
                          {new Date(guide.updatedAt).toLocaleDateString()}
                        </td>
                        <td className={`px-6 py-4 ${isRTL ? 'rounded-l-2xl' : 'rounded-r-2xl'} ${isRTL ? 'text-start' : 'text-end'}`}>
                          <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-end'} gap-2`}>
                            <Link 
                              href={`/admin/editor?id=${guide.id}`} 
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-app hover:bg-white/10 transition-all"
                              title={t("edit_guide")}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteGuide(guide.id)}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                              title={t("delete_guide")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link 
                              href={`/guide/${guide.slug}`}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-app hover:bg-white/10 transition-all"
                              title={t("view_guide")}
                            >
                              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
