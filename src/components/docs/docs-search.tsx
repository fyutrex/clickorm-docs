"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { docsConfig } from "@/config/docs"

interface SearchResult {
  title: string
  href: string
  category: string
}

export function DocsSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    // Simple search through sidebar items
    const searchResults: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    docsConfig.sidebarNav.forEach((section) => {
      section.items?.forEach((item) => {
        if (item.title.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            title: item.title,
            href: item.href,
            category: section.title,
          })
        }

        item.items?.forEach((subItem) => {
          if (subItem.title.toLowerCase().includes(lowerQuery)) {
            searchResults.push({
              title: subItem.title,
              href: subItem.href,
              category: `${section.title} › ${item.title}`,
            })
          }
        })
      })
    })

    setResults(searchResults.slice(0, 10))
  }, [query])

  const handleSelect = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px] p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="sr-only">Search Documentation</DialogTitle>
          </DialogHeader>
          <div className="border-b px-4 pb-4">
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search documentation..."
                className="border-0 shadow-none focus-visible:ring-0 px-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {results.length === 0 && query && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            )}
            {results.length === 0 && !query && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Type to search documentation...
              </div>
            )}
            {results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.href}-${index}`}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-accent transition-colors"
                    onClick={() => handleSelect(result.href)}
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {result.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}