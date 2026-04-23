"use client";

import { useState, useEffect, Suspense } from "react";
import { createCategory, updateCategory, getCategories } from "@/lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";
import { Layers, ArrowLeft, Loader2, Save } from "lucide-react";

function CategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      const load = async () => {
        const categories = await getCategories();
        const cat = categories.find(c => c.id === Number(categoryId));
        if (cat) {
          setName(cat.name);
          setSlug(cat.slug);
        }
        setIsLoading(false);
      };
      load();
    }
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      const finalSlug = slug.trim() || slugify(name, { lower: true, strict: true }) || `cat-${Date.now()}`;
      
      if (categoryId) {
        await updateCategory(Number(categoryId), { name, slug: finalSlug });
      } else {
        await createCategory({ name, slug: finalSlug });
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin accent-green" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <button 
        onClick={() => router.push("/admin")}
        className="flex items-center gap-2 text-muted hover:text-app transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/20 mb-4">
          <Layers className="w-8 h-8 accent-green" />
        </div>
        <h1 className="text-3xl font-extrabold text-app tracking-tight mb-2">
          {categoryId ? "Edit" : "New"} <span className="accent-green">Category</span>
        </h1>
        <p className="text-muted">Organize your guides into logical collections.</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-app ml-1">Category Name</label>
            <input 
              type="text" 
              className="w-full rounded-xl px-4 py-4 transition-all ring-accent-green bg-white/5 text-app border border-white/10 placeholder:text-slate-600 outline-none"
              value={name}
              placeholder="e.g. Frontend Development"
              onChange={(e) => {
                setName(e.target.value);
                if (!categoryId) setSlug(slugify(e.target.value, { lower: true, strict: true }));
              }}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-app ml-1">Slug (URL Path)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-more font-mono text-sm">/</span>
              <input 
                type="text" 
                className="w-full rounded-xl pl-8 pr-4 py-4 transition-all ring-accent-green bg-white/5 text-app border border-white/10 placeholder:text-slate-600 outline-none font-mono text-sm"
                value={slug}
                placeholder="frontend-dev"
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gradient-to-r from-lime-500 to-lime-400 text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none shadow-lg shadow-lime-500/10"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{categoryId ? "Update Category" : "Create Category"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin accent-green mx-auto mt-20" />}>
      <CategoryForm />
    </Suspense>
  );
}
