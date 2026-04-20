"use client";

import { useState } from "react";
import { createGuide, updateGuide } from "@/lib/actions";
import { useRouter } from "next/navigation";
import slugify from "slugify";

export function EditorClient({ categories, initialData }: { categories: any[], initialData: any }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || (categories[0]?.id || 0),
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    content: initialData?.content || "",
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
        const finalSlug = formData.slug || slugify(formData.title, { lower: true, strict: true }) || `guide-${Date.now()}`;
        await createGuide({ ...formData, slug: finalSlug });
      }
      router.push("/admin");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>Guide Details</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
            <select 
              className="input-base" 
              style={{ width: '100%' }}
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
              required
            >
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Slug (Auto-generated)</label>
            <input 
              type="text" 
              className="input-base" 
              style={{ width: '100%', opacity: 0.7 }}
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              placeholder="e.g. linux-commands"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
          <input 
            type="text" 
            className="input-base" 
            style={{ width: '100%', fontSize: '1.2rem', padding: '12px 16px' }}
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            autoComplete="off"
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Formatted Content (Markdown)</label>
           <textarea 
             className="input-base" 
             style={{ width: '100%', height: '500px', fontFamily: 'monospace', lineHeight: 1.6 }}
             value={formData.content}
             onChange={(e) => setFormData({...formData, content: e.target.value})}
             required
           />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" className="btn-secondary" onClick={() => router.push("/admin")}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ minWidth: '160px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Guide'}
          </button>
        </div>
      </form>
    </div>
  );
}

