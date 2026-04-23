"use client";

import { useState } from "react";
import { createGuide, updateGuide } from "@/lib/actions";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { ArrowLeft, Save, Loader2, FileText, Globe, Hash } from "lucide-react";

export function EditorClient({ categories, initialData }: { categories: any[], initialData: any }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    categoryIds: initialData?.categories?.map((c: any) => c.id) || [categories[0]?.id || 0],
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    content: initialData?.content || "",
    tags: initialData?.tags || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return alert("Title and Content are required.");
    
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateGuide(initialData.id, formData);
      } else {
        const finalSlug = formData.slug.trim() || slugify(formData.title, { lower: true, strict: true }) || `guide-${Date.now()}`;
        await createGuide({ ...formData, slug: finalSlug });
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      <button 
        onClick={() => router.push("/admin")}
        className="flex items-center gap-2 text-muted hover:text-app transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/20 mb-4">
          <FileText className="w-8 h-8 accent-green" />
        </div>
        <h1 className="text-3xl font-extrabold text-app tracking-tight mb-2">
          {initialData ? "Edit" : "Create"} <span className="accent-green">Guide</span>
        </h1>
        <p className="text-muted">Draft and publish your technical documentation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Metadata Section */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-app border-b border-white/5 pb-4 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 accent-green" />
              Metadata
            </h3>
            
            <div className="space-y-4">
              <label className="text-sm font-semibold text-app ml-1 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-[10px] text-muted-more uppercase tracking-widest font-bold">Select Multiple</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c: any) => {
                  const isSelected = formData.categoryIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        const newIds = isSelected 
                          ? formData.categoryIds.filter((id: number) => id !== c.id)
                          : [...formData.categoryIds, c.id];
                        setFormData({ ...formData, categoryIds: newIds });
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                        ${isSelected 
                          ? 'bg-lime-500/15 border-lime-500/40 text-app shadow-[0_0_15px_rgba(163,230,53,0.1)]' 
                          : 'bg-white/5 border-white/10 text-muted hover:border-white/20'}
                      `}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-app ml-1">Slug (URL Path)</label>
              <input 
                type="text" 
                className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-app placeholder:text-slate-600 outline-none ring-accent-green font-mono text-xs"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="e.g. nginx-setup-guide"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-app ml-1">Tags (Comma separated)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  className="w-full rounded-xl pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-app placeholder:text-slate-600 outline-none ring-accent-green text-sm"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="docker, nginx, security"
                />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-center">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-app ml-1">Guide Title</label>
              <input 
                type="text" 
                className="w-full rounded-xl px-4 py-4 bg-white/5 border border-white/10 text-app placeholder:text-slate-600 outline-none ring-accent-green text-xl font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="How to set up Nginx..."
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-4">
          <label className="text-sm font-semibold text-app ml-1">Content (Markdown)</label>
          <textarea 
            className="w-full rounded-2xl p-6 bg-white/5 border border-white/10 text-app placeholder:text-slate-600 outline-none ring-accent-green font-mono text-sm leading-relaxed min-h-[500px] resize-none"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            placeholder="Write your guide content here using Markdown..."
          />
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-muted font-bold hover:bg-white/10 transition-all"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.content}
            className="flex items-center gap-2 px-12 py-4 rounded-xl font-bold bg-gradient-to-r from-lime-500 to-lime-400 text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none shadow-lg shadow-lime-500/10"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{initialData ? "Update Guide" : "Create Guide"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
