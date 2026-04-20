"use client";

import { deleteGuide } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminClientList({ categories }: { categories: any[] }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this guide?")) {
      await deleteGuide(id);
      router.refresh();
    }
  };

  return (
    <div>
      {categories.map((cat: any) => (
        <div key={cat.id} className="glass animate-fade-in-up" style={{ marginBottom: '40px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(121, 174, 111, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="neon-tag" style={{ background: 'var(--accent-deep)', borderColor: 'var(--accent-green)' }}>{cat.slug}</span>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{cat.name}</h3>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{cat.guides.length} guides</span>
          </div>
          
          {cat.guides.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No guides found in this category.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', marginTop: '10px' }}>
              <thead>
                <tr style={{ textAlign: 'left', opacity: 0.6, fontSize: '0.85rem' }}>
                  <th style={{ padding: '0 12px' }}>Title</th>
                  <th style={{ padding: '0 12px', textAlign: 'center', width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cat.guides.map((guide: any) => (
                  <tr key={guide.id} style={{ background: 'rgba(255, 255, 255, 0.03)', transition: 'background 0.3s' }}>
                    <td style={{ padding: '16px 12px', borderRadius: '12px 0 0 12px', fontWeight: 600 }}>{guide.title}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Link href={`/admin/editor?id=${guide.id}`} className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '6px 12px' }}>
                          Edit
                        </Link>
                        <button className="btn-secondary" 
                                style={{ color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)', fontSize: '0.8rem', padding: '6px 12px' }} 
                                onClick={() => handleDelete(guide.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

