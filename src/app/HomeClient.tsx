"use client";

import Link from "next/link";
import styles from "./HomeClient.module.css";

export function HomeClient({ guides }: { guides: any[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome to JK Wiki
        </h1>
        <p className={styles.subtitle}>
          Unified knowledge base powered by AI.
        </p>
      </div>

      <div className={styles.grid}>
        {guides.length === 0 && (
           <p style={{textAlign: 'center', width: '100%', color: 'var(--text-secondary)'}}>
             No guides found.
           </p>
        )}
        {guides.map((guide: any, index: number) => (
          <Link 
            href={`/guide/${guide.slug}`} 
            key={guide.id} 
            className={`glass ${styles.card} animate-fade-in-up`}
            style={{ animationDelay: `${(index % 6) * 0.1}s` }}
          >
             <div className={styles.cardHeader}>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(guide.categories || (guide.category ? [guide.category] : [])).map((c: any, i: number) => (
                    <span key={i} className={`neon-tag ${styles.categoryTag}`}>
                      {c.name}
                    </span>
                  ))}
                </div>
             </div>
             <h2 className={styles.cardTitle}>
                {guide.title}
             </h2>
             <p className={styles.cardExcerpt}>
                {/* Simple excerpt generation */}
                {(guide.content || "").substring(0, 120).replace(/[#*`>]/g, '')}...
             </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

