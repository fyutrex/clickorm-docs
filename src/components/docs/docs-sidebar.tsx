"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { docsConfig } from "@/config/docs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocsSidebarProps {
  className?: string
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-lg">Documentation</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-4 py-6">
          <nav className="space-y-6">
            {docsConfig.sidebarNav.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 px-2 text-sm font-semibold text-foreground">
                  {section.title}
                </h4>
                {section.items && (
                  <DocsSidebarItems items={section.items} pathname={pathname} />
                )}
              </div>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  )
}

interface DocsSidebarItemsProps {
  items: Array<{
    title: string
    href: string
    items?: Array<{
      title: string
      href: string
    }>
  }>
  pathname: string
}

function DocsSidebarItems({ items, pathname }: DocsSidebarItemsProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href
        const hasChildren = item.items && item.items.length > 0
        const [isOpen, setIsOpen] = React.useState(
          hasChildren && item.items?.some((child) => pathname === child.href)
        )

        return (
          <div key={item.href}>
            <div className="flex items-center">
              {hasChildren && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="mr-1 p-1 hover:bg-accent rounded-sm transition-colors"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen && "rotate-90"
                    )}
                  />
                </button>
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex-1 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-accent",
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  !hasChildren && "ml-6"
                )}
              >
                {item.title}
              </Link>
            </div>
            {hasChildren && isOpen && item.items && (
              <div className="ml-6 mt-1 space-y-1 border-l pl-4">
                {item.items.map((child) => {
                  const isChildActive = pathname === child.href
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-accent",
                        isChildActive
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {child.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}