import { getCategories } from "@/lib/actions";
import Link from "next/link";
import { AdminClientList } from "./AdminClientList";
import { Plus, Settings, BookOpen, Layers, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/actions";

export default async function AdminPage() {
  const categories = await getCategories();
  const totalGuides = categories.reduce((acc, cat) => acc + (cat.guides?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-app">
            Admin <span className="accent-green">Dashboard</span>
          </h1>
          <p className="text-muted mt-2">Manage your content, categories, and site settings.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <form action={logoutAdmin}>
             <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-red-400 hover:border-red-400/30 transition-all">
               <LogOut className="w-4 h-4" />
               <span className="text-sm font-semibold">Logout</span>
             </button>
           </form>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 accent-green" />
            </div>
            <span className="text-sm font-bold text-muted uppercase tracking-wider">Total Guides</span>
          </div>
          <p className="text-4xl font-extrabold text-app">{totalGuides}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-bold text-muted uppercase tracking-wider">Categories</span>
          </div>
          <p className="text-4xl font-extrabold text-app">{categories.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link 
          href="/admin/editor" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-lime-500 to-lime-400 text-black font-bold shadow-lg shadow-lime-500/10 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Guide
        </Link>
        <Link 
          href="/admin/category" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-app font-bold hover:bg-white/10 transition-all"
        >
          <Plus className="w-5 h-5 accent-green" />
          Add Category
        </Link>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <Settings className="w-5 h-5 text-muted" />
          <h2 className="text-xl font-bold text-app">Content Management</h2>
        </div>
        <AdminClientList categories={categories} />
      </div>
    </div>
  );
}
