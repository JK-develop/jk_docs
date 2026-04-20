"use client";

import { useState } from "react";
import { createCategory } from "@/lib/actions";
import { useRouter } from "next/navigation";
import slugify from "slugify";

export default function CategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      const slug = slugify(name, { lower: true, strict: true }) || `cat-${Date.now()}`;
      await createCategory({ name, slug });
      router.push("/admin");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="prose animate-fade-in-up" 
         style={{ 
           padding: '50px', 
           borderRadius: '24px', 
           maxWidth: '800px', 
           margin: '0 auto',
           background: 'var(--card-bg)',
           border: '1px solid var(--border-color)'
         }}>
      <h2 style={{marginTop: 0, borderBottom: '2px solid var(--border-color)', paddingBottom: '16px'}}>Add New Category</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>Category Name</label>
          <input 
            type="text" 
            className="input-base" 
            style={{ width: '100%', fontSize: '1.2rem', padding: '16px' }}
            value={name}
            placeholder="e.g. Linux Configs, DevOps, Programming"
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" className="btn-secondary" onClick={() => router.push("/admin")}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
