"use client"

import { ReactNode, useState } from "react"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsHeader } from "@/components/docs/docs-header"
import { TableOfContents } from "@/components/docs/table-of-contents"
import { cn } from "@/lib/utils"

interface DocsLayoutProps {
  children: ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <DocsHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_200px] md:gap-6 lg:gap-10">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-14 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 border-r bg-background md:sticky md:block md:w-[240px]",
            sidebarOpen ? "block" : "hidden"
          )}
        >
          <DocsSidebar />
        </aside>

        {/* Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
        </main>

        {/* Table of Contents - Desktop Only */}
        <aside className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] text-sm lg:block shrink-0 overflow-y-auto">
          <div className="py-8">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  )
}