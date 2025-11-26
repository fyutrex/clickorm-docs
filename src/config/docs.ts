import { DocsConfig } from "@/types"

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Examples",
      href: "/docs/examples",
    },
    {
      title: "GitHub",
      href: "https://github.com/yourusername/clickorm",
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      href: "/docs",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
        },
      ],
    },
    {
      title: "Core Concepts",
      href: "/docs/core-concepts",
      items: [
        {
          title: "Models",
          href: "/docs/core-concepts/models",
        },
        {
          title: "Schemas",
          href: "/docs/core-concepts/schemas",
        },
        {
          title: "Queries",
          href: "/docs/core-concepts/queries",
        },
        {
          title: "Relations",
          href: "/docs/core-concepts/relations",
        },
        {
          title: "Hooks",
          href: "/docs/core-concepts/hooks",
        },
      ],
    },
    {
      title: "API Reference",
      href: "/docs/api",
      items: [
        {
          title: "Client",
          href: "/docs/api/client",
        },
        {
          title: "Model",
          href: "/docs/api/model",
        },
        {
          title: "Query Builder",
          href: "/docs/api/query-builder",
        },
        {
          title: "Schema Builder",
          href: "/docs/api/schema-builder",
        },
      ],
    },
    {
      title: "Guides",
      href: "/docs/guides",
      items: [
        {
          title: "Migrations",
          href: "/docs/guides/migrations",
        },
        {
          title: "Testing",
          href: "/docs/guides/testing",
        },
        {
          title: "Performance",
          href: "/docs/guides/performance",
        },
        {
          title: "Best Practices",
          href: "/docs/guides/best-practices",
        },
      ],
    },
    {
      title: "Examples",
      href: "/docs/examples",
      items: [
        {
          title: "Basic Usage",
          href: "/docs/examples/basic-usage",
        },
        {
          title: "Advanced Queries",
          href: "/docs/examples/advanced-queries",
        },
        {
          title: "Real-world Apps",
          href: "/docs/examples/real-world",
        },
      ],
    },
  ],
}