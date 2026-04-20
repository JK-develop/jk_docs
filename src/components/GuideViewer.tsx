"use client";

import React from "react";
import { Calendar, Tag, ChevronRight } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export function GuideViewer() {
  const sampleNginxConfig = `# Simple Nginx Proxy Configuration
server {
    listen 80;
    server_name jk-wiki.test;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
`;

  return (
    <div className="animate-fade-in py-6">
      {/* Header Section */}
      <header className="mb-10 lg:mb-12">
        <div className="flex items-center gap-2 accent-green text-xs font-semibold uppercase tracking-widest mb-4">
          <span>Docs</span>
          <ChevronRight className="w-3 h-3" />
          <span>DevOps</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-gray-100 mb-6 leading-tight tracking-tight">
          How to Setup Nginx Reverse Proxy with Docker
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 glass-input px-3 py-1 rounded-full border border-black/10 dark:border-white/10">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-500" />
            <span className="text-slate-700 dark:text-slate-300">Updated April 14, 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <div className="flex gap-2">
              {['docker', 'nginx', 'deployment'].map(tag => (
                <span key={tag} className="px-2.5 py-0.5 bg-lime-500/10 dark:bg-lime-400/15 accent-green border border-lime-500/20 dark:border-lime-400/30 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <article className="prose max-w-none dark:prose-invert prose-slate dark:prose-slate prose-a:accent-green dark:prose-a:accent-green">
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          Nginx acts as a powerful gateway for your Dockerized applications. By setting up a reverse proxy, you can handle SSL termination, load balancing, and simple domain routing without exposing your internal container ports to the public internet.
        </p>

        <h3 className="text-2xl mt-10 mb-6 font-bold flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--accent-green)] text-white dark:text-black text-sm">1</span>
          Prerequisites and Environment
        </h3>
        <p>
          Before we begin, ensure you have <strong>Docker</strong> and <strong>Docker Compose</strong> installed on your machine. We will be using a shared network to allow Nginx to communicate with your app container.
        </p>

        <CodeBlock 
          language="bash" 
          code="docker network create proxy-network" 
        />

        <h3 className="text-2xl mt-10 mb-6 font-bold flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--accent-green)] text-white dark:text-black text-sm">2</span>
          Configuring the Nginx Server
        </h3>
        <p>
          Create a <code>nginx.conf</code> file in your project root. This configuration redirects traffic from port 80 to our internal service running at port 3000.
        </p>

        <CodeBlock 
          language="nginx" 
          code={sampleNginxConfig} 
        />

        <h3 className="text-2xl mt-10 mb-6 font-bold flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--accent-green)] text-white dark:text-black text-sm">3</span>
          Deployment Steps
        </h3>
        <ol>
          <li>Save the configuration file locally.</li>
          <li>Start your application container on the <code>proxy-network</code>.</li>
          <li>Launch the Nginx container mounting the config file.</li>
          <li>Verify connectivity by visiting your local domain.</li>
        </ol>

        <div className="mt-12 p-6 bg-lime-500/5 dark:bg-lime-400/10 border-l-4 border-[color:var(--accent-green)] rounded-r-xl">
          <p className="m-0 text-slate-800 dark:text-slate-200 font-medium">
            <strong>Pro Tip:</strong> For production environments, always use Docker secrets or environment variables for sensitive configurations like SSL certificate paths.
          </p>
        </div>
      </article>
    </div>
  );
}
