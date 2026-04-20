import React from "react";
import { getCategories } from "@/lib/actions";
import { KnowledgeForm } from "@/components/KnowledgeForm";
import { withDefaultCategories } from "@/lib/defaultCategories";

export const metadata = {
  title: "Add Knowledge | JK Docs",
  description: "Create structured documentation.",
};

export default async function AddKnowledgePage() {
  const categories = withDefaultCategories(await getCategories());

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Page Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-gray-100 mb-4 tracking-tight">
            New <span className="accent-green">Guide</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Create, structure, and categorize your technical notes into robust documentation.
          </p>
        </div>

        {/* Integration of the main form */}
        <KnowledgeForm categories={categories} />
      </div>
    </div>
  );
}
