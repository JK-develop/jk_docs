"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-slate-700 bg-[#0b1222] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs font-mono text-gray-400 lowercase">{language}</span>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[10px] text-green-400 font-medium tracking-wide uppercase">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] uppercase font-medium tracking-wide">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed text-gray-300">
          <code className="block whitespace-pre">
            {code.split('\n').map((line, i) => (
              <span key={i} className="block">
                <span className="select-none text-slate-600 inline-block w-6 text-right mr-4">{i + 1}</span>
                {/* Visual syntax highlighting mocks via spans */}
                <span dangerouslySetInnerHTML={{ __html: mockHighlight(line) }} />
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Simple regex helper for mock syntax highlighting
function mockHighlight(line: string) {
  return line
    .replace(/^(#.*)$/g, '<span class="text-slate-500 italic">$1</span>') // Comments
    .replace(/(\".*?\")/g, '<span class="text-emerald-400">$1</span>') // Strings
    .replace(/\b(export|import|from|const|let|var|function|return|if|else|for|while|await|async)\b/g, '<span class="text-sky-400 font-medium">$1</span>') // Keywords
    .replace(/\b(apt|git|docker|npm|npx|sudo|systemctl|nginx)\b/g, '<span class="text-amber-400 font-medium">$1</span>') // Commands
    .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>'); // Numbers
}
