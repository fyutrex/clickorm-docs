/**
 * Markdown Renderer Configuration
 * This file contains configuration for markdown rendering,
 * including syntax highlighting themes and plugin settings.
 */

import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const markdownConfig = {
  // Syntax highlighting themes based on dark/light mode
  syntaxThemes: {
    dark: vscDarkPlus,
    light: vs,
  },

  // Rehype autolink headings configuration
  autolinkHeadings: {
    behavior: 'wrap' as const,
    properties: {
      className: ['heading-anchor'],
    },
  },

  // Code block configuration
  codeBlock: {
    showLineNumbers: false,
    wrapLines: true,
    customStyle: {
      borderRadius: '0.375rem', // rounded-md
      padding: '1rem',
    },
  },

  // Supported languages for syntax highlighting
  supportedLanguages: [
    'typescript',
    'javascript',
    'tsx',
    'jsx',
    'json',
    'bash',
    'shell',
    'sql',
    'markdown',
    'yaml',
    'css',
    'html',
    'python',
    'go',
    'rust',
    'java',
    'csharp',
    'php',
  ],
} as const;

export type MarkdownConfig = typeof markdownConfig;