'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { useTheme } from 'next-themes';
import { markdownConfig } from '@/config/markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const syntaxTheme = isDark ? markdownConfig.syntaxThemes.dark : markdownConfig.syntaxThemes.light;

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm, // GitHub Flavored Markdown
          remarkBreaks, // Convert line breaks to <br>
        ]}
        rehypePlugins={[
          rehypeHighlight, // Syntax highlighting
          rehypeSlug, // Add IDs to headings
          [rehypeAutolinkHeadings, markdownConfig.autolinkHeadings],
        ]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const inline = !language;

            return !inline && language ? (
              <SyntaxHighlighter
                style={syntaxTheme}
                language={language}
                PreTag="div"
                className="rounded-md overflow-hidden"
                showLineNumbers={markdownConfig.codeBlock.showLineNumbers}
                wrapLines={markdownConfig.codeBlock.wrapLines}
                customStyle={markdownConfig.codeBlock.customStyle}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${className} px-1.5 py-0.5 rounded bg-muted text-sm font-mono`}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold tracking-tight mb-4 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold tracking-tight mb-3 mt-6 border-b pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold tracking-tight mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold tracking-tight mb-2 mt-3">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold tracking-tight mb-2 mt-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold tracking-tight mb-2 mt-2">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-muted-foreground">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc [&>li]:mt-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal [&>li]:mt-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-7 text-muted-foreground">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6 border-border" />
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto my-4"
            />
          ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}