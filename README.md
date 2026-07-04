# ClickORM Documentation v: 0.0.1

Official documentation website for ClickORM - A TypeScript ORM for ClickHouse.

## Features

- 📚 Comprehensive documentation with MDX support
- 🎨 Beautiful hero section with Three.js animation
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🔍 Syntax highlighting for code examples
- ⚡ Built with Next.js 15 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation.

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## Project Structure

```
clickorm-docs/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── docs/         # Documentation pages
│   │   ├── privacy/      # Privacy policy page
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── docs/         # Documentation-specific components
│   │   ├── ui/           # shadcn/ui components
│   │   └── hero-section.tsx
│   ├── lib/              # Utility functions
│   ├── config/           # Configuration files
│   └── hooks/            # Custom React hooks
├── content/              # MDX documentation content
│   ├── docs/
│   └── privacy.mdx
└── public/               # Static assets
```

## Adding Documentation

1. Create a new `.mdx` file in the `content/docs/` directory
2. Add frontmatter with title and description:

```mdx
---
title: Your Page Title
description: Page description
---

# Your Content Here
```

3. The page will be automatically available at `/docs/your-file-name`

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **3D Graphics**: Three.js
- **MDX**: next-mdx-remote
- **Theme**: next-themes

## License

MIT License - see the [LICENSE](../LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.