"use client";

import { deleteGuide, deleteCategory } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, FileText, ChevronRight, Hash } from "lucide-react";

export function AdminClientList({ categories }: { categories: any[] }) {
  const router = useRouter();

  const handleDeleteGuide = async (id: number) => {
    if (confirm("Are you sure you want to delete this guide?")) {
      await deleteGuide(id);
      router.refresh();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Delete this category? All guides in it will be orphaned or must be moved first. (Prisma might prevent this if relations exist)")) {
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
                <Hash className="w-6 h-6 accent-green" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-app">{cat.name}</h3>
                <p className="text-muted text-sm tracking-tight opacity-70">/{cat.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                {cat.guides.length} Guides
              </span>
              <div className="flex items-center gap-1">
                <Link 
                  href={`/admin/category?id=${cat.id}`}
                  className="p-2 rounded-lg text-muted hover:text-app hover:bg-white/10 transition-all"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Delete Category"
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
                <p>No guides in this category yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                      <th className="px-6 py-3">Title / Slug</th>
                      <th className="px-6 py-3">Last Updated</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.guides.map((guide: any) => (
                      <tr key={guide.id} className="group bg-white/2 hover:bg-white/5 transition-all transition-colors duration-300">
                        <td className="px-6 py-4 rounded-l-2xl">
                          <div className="flex flex-col">
                            <span className="text-app font-bold group-hover:accent-green transition-colors">{guide.title}</span>
                            <span className="text-xs text-muted-more font-mono opacity-50">{guide.slug}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">
                          {new Date(guide.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 rounded-r-2xl text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/admin/editor?id=${guide.id}`} 
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-app hover:bg-white/10 transition-all"
                              title="Edit Guide"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteGuide(guide.id)}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                              title="Delete Guide"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link 
                              href={`/guide/${guide.slug}`}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-app hover:bg-white/10 transition-all"
                              title="View Guide"
                            >
                              <ChevronRight className="w-4 h-4" />
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
