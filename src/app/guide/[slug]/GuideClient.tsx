"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useLanguage } from "@/components/LanguageContext";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="neon-tag"
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        fontSize: '0.7rem',
        padding: '4px 8px',
        cursor: 'pointer',
        zIndex: 10,
        opacity: 0.8,
        background: copied ? 'var(--accent-deep)' : 'rgba(121, 174, 111, 0.2)',
      }}
    >
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}

export function GuideClient({ guide }: { guide: any }) {
  const { t, isRTL } = useLanguage();
  
  if (!guide) return <div className="text-center py-20 text-muted">{t("no_results")}</div>;

  return (
    <div className={`animate-fade-in-up ${isRTL ? 'rtl' : 'ltr'}`} 
         style={{ 
           maxWidth: '900px', 
           margin: '0 auto', 
           paddingBottom: '80px',
         }}>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
           {(guide.categories || (guide.category ? [guide.category] : [])).map((c: any) => (
             <span key={c.id} className="neon-tag" style={{ fontSize: '0.7rem' }}>{isRTL && c.nameFa ? c.nameFa : c.name}</span>
           ))}
           {guide.tags && guide.tags.split(',').map((tag: string) => (
             <span key={tag} className="glass-input" style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
               # {tag.trim()}
             </span>
           ))}
        </div>
        <h1 style={{ 
          color: 'var(--text-primary)', 
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: 0,
          lineHeight: 1.2
        }}>{guide.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.1rem' }}>
          {isRTL ? 'آخرین بروزرسانی: ' : 'Last updated: '} {new Date(guide.updatedAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US')}
        </p>
      </header>

      <div
        className="prose prose-invert prose-lg max-w-none"
        style={{
          textAlign: isRTL ? 'right' : 'left',
          /* Override prose defaults for our dark theme */
          "--tw-prose-body": "#cbd5e1",
          "--tw-prose-headings": "#f8fafc",
          "--tw-prose-lead": "#94a3b8",
          "--tw-prose-links": "#a3e635",
          "--tw-prose-bold": "#f8fafc",
          "--tw-prose-counters": "#94a3b8",
          "--tw-prose-bullets": "#a3e635",
          "--tw-prose-hr": "rgba(255,255,255,0.1)",
          "--tw-prose-quotes": "#cbd5e1",
          "--tw-prose-quote-borders": "rgba(163,230,53,0.4)",
          "--tw-prose-captions": "#94a3b8",
          "--tw-prose-code": "#a3e635",
          "--tw-prose-pre-code": "#e2e8f0",
          "--tw-prose-pre-bg": "#0d1f17",
          "--tw-prose-th-borders": "rgba(255,255,255,0.12)",
          "--tw-prose-td-borders": "rgba(255,255,255,0.08)",
        } as React.CSSProperties}
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              const codeString = String(children).replace(/\n$/, '');
              
              return !inline && match ? (
                <div style={{ position: 'relative', direction: 'ltr' }}>
                  <CopyButton code={codeString} />
                  <SyntaxHighlighter
                    style={atomDark as any}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '16px',
                      padding: '24px',
                      backgroundColor: 'var(--code-bg)',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {guide.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
