"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { 
  Tag as TagIcon, 
  X, 
  Sparkles, 
  ChevronDown, 
  Plus,
  Info,
} from "lucide-react";
import slugify from "slugify";
import { saveLocalGuide } from "@/lib/localGuides";
import {
  loadLocalCategories,
  onCategoriesUpdated,
  saveLocalCategory,
  type CategoryIconKey,
} from "@/lib/localCategories";

interface Category {
  id: number | string;
  name: string;
}

interface KnowledgeFormProps {
  categories: Category[];
}

export function KnowledgeForm({ categories }: KnowledgeFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [title, setTitle] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Array<number | string>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const formattedRef = useRef<HTMLTextAreaElement>(null);

  const [localCategories, setLocalCategories] = useState<{ id: string; name: string; iconKey: CategoryIconKey }[]>([]);

  const allCategories = useMemo(() => {
    const merged: Category[] = [...categories];
    for (const c of localCategories) {
      if (!merged.some((m) => m.name.toLowerCase() === c.name.toLowerCase())) {
        merged.push({ id: c.id, name: c.name } as Category);
      }
    }
    return merged;
  }, [categories, localCategories]);

  const canSave = useMemo(() => formattedContent.trim().length > 0 && selectedCategories.length > 0, [formattedContent, selectedCategories]);

  useEffect(() => {
    setLocalCategories(loadLocalCategories());
    return onCategoriesUpdated(() => setLocalCategories(loadLocalCategories()));
  }, []);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };



  const applyMarkdown = (type: "bold" | "italic" | "inlineCode" | "codeBlock" | "list") => {
    const el = formattedRef.current;
    if (!el) return;

    const value = formattedContent;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end);

    const wrap = (before: string, after = before) => {
      const next = value.slice(0, start) + before + (selected || "") + after + value.slice(end);
      setFormattedContent(next);

      window.requestAnimationFrame(() => {
        el.focus();
        const cursor = start + before.length + (selected || "").length + after.length;
        el.setSelectionRange(cursor, cursor);
      });
    };

    const insert = (text: string) => {
      const next = value.slice(0, start) + text + value.slice(end);
      setFormattedContent(next);

      window.requestAnimationFrame(() => {
        el.focus();
        const cursor = start + text.length;
        el.setSelectionRange(cursor, cursor);
      });
    };

    if (type === "bold") return wrap("**");
    if (type === "italic") return wrap("*");
    if (type === "inlineCode") return wrap("`");
    if (type === "codeBlock") return insert(`\n\`\`\`\n${selected || ""}\n\`\`\`\n`);
    if (type === "list") {
      if (!selected) return insert("\n- ");
      const lines = selected.split("\n").map((l) => (l.trim().length ? `- ${l}` : l));
      return insert(`\n${lines.join("\n")}\n`);
    }
  };

  const handleSave = async () => {
    if (!formattedContent.trim()) return;
    if (selectedCategories.length === 0) return;

    setIsSaving(true);
    try {
      const resolvedTitle =
        title.trim() ||
        "Untitled Guide";

      const categoryNames = selectedCategories
        .map(id => allCategories.find((c) => c.id === id))
        .filter(Boolean)
        .map(c => ({ id: c!.id, name: c!.name }));

      const createdAt = new Date().toISOString();
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const slugBase = slugify(resolvedTitle, { lower: true, strict: true, trim: true }) || "guide";
      const resolvedSlug = `${slugBase}-${Date.now().toString(36)}`;

      const description = formattedContent.trim().replace(/\s+/g, " ").slice(0, 160);

      saveLocalGuide({
        id,
        slug: resolvedSlug,
        title: resolvedTitle,
        description,
        content: formattedContent,
        categories: categoryNames.length > 0 ? categoryNames : [{ name: "General" }],
        tags,
        createdAt,
      });

      setTitle("");
      setFormattedContent("");
      setTags([]);
      setTagInput("");
      setSelectedCategories([]);

      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/70 dark:bg-white/5 backdrop-blur-lg border border-slate-300 dark:border-white/10 rounded-3xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[color:var(--accent-green)] rounded-2xl flex items-center justify-center shadow-lg shadow-[color:rgba(163,230,53,0.25)]">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Add Knowledge</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Create structured documentation.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-slate-900 dark:text-slate-100 ml-1">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter a descriptive title..."
            className="w-full rounded-xl px-4 py-3 transition-all ring-accent-green bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Categories multi-select */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 ml-1">Categories <span className="text-[color:var(--accent-green)]">*</span></label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => {
              const isSelected = selectedCategories.includes(c.id);
              return (
                <button
                  key={String(c.id)}
                  type="button"
                  onClick={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(c.id)
                        ? prev.filter((id) => id !== c.id)
                        : [...prev, c.id]
                    );
                  }}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all border
                    ${isSelected
                      ? 'bg-[color:rgba(163,230,53,0.15)] border-[color:var(--accent-green)] text-slate-900 dark:text-white shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                      : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-white/20'}
                  `}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-xs text-red-400 ml-1">Please select at least one category.</p>
          )}
        </div>

        {/* Tags Row */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 ml-1">Tags</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Press Enter to add..."
              className="w-full rounded-xl pl-10 pr-4 py-3 transition-all ring-accent-green bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-500 group-focus-within:accent-green transition-colors" />
          </div>
        </div>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 bg-[color:rgba(163,230,53,0.10)] dark:bg-[color:rgba(163,230,53,0.10)] border border-[color:rgba(163,230,53,0.25)] px-3 py-1 rounded-lg text-xs font-semibold animate-in zoom-in-75 text-slate-700 dark:text-slate-300">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}


        {/* Formatted Content */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 ml-1">
            Formatted Content (Markdown)
          </label>
          <div className="rounded-2xl border border-slate-300 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-300 dark:border-white/10 bg-white dark:bg-white/5">
              <button
                type="button"
                onClick={() => applyMarkdown("bold")}
                className="px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-extrabold hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5"
                aria-label="Bold"
                title="Bold (**text**)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyMarkdown("italic")}
                className="px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-bold italic hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5"
                aria-label="Italic"
                title="Italic (*text*)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyMarkdown("inlineCode")}
                className="px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-mono hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5"
                aria-label="Inline code"
                title="Inline code (`code`)"
              >
                {"</>"}
              </button>
              <button
                type="button"
                onClick={() => applyMarkdown("codeBlock")}
                className="px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-mono hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5"
                aria-label="Code block"
                title="Code block (```)"
              >
                {"```"}
              </button>
              <button
                type="button"
                onClick={() => applyMarkdown("list")}
                className="px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-extrabold hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5"
                aria-label="List"
                title="List (- item)"
              >
                • List
              </button>
            </div>

            <textarea
              ref={formattedRef}
              rows={12}
              placeholder="Write or paste Markdown here…"
              className="w-full bg-white dark:bg-white/5 px-5 py-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all resize-none font-mono text-sm leading-relaxed ring-accent-green"
              value={formattedContent}
              onChange={(e) => setFormattedContent(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className={`
              w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all
              ${canSave && !isSaving
                ? 'bg-gradient-to-r from-[color:var(--accent-green)] to-lime-400 text-black shadow-xl shadow-[0_18px_40px_rgba(163,230,53,0.18)] hover:scale-[1.02] active:scale-[0.98]'
                : 'glass-input text-muted cursor-not-allowed'}
            `}
            aria-label="Save guide"
          >
            <Plus className={`w-5 h-5 ${isSaving ? "animate-pulse" : ""}`} />
            {isSaving ? "Saving..." : justSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
