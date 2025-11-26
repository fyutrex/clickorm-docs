"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = React.useState<TocItem[]>([])
  const [activeId, setActiveId] = React.useState<string>("")
  const pathname = usePathname()

  React.useEffect(() => {
    // Extract headings from the document
    const headings = Array.from(
      document.querySelectorAll("article h2, article h3, article h4")
    )

    const tocItems: TocItem[] = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName.substring(1)),
    }))

    setToc(tocItems)

    // Set up intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [pathname])

  if (toc.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-semibold text-sm mb-4">On This Page</p>
      <nav>
        <ul className="space-y-2 text-sm">
          {toc.map((item) => {
            const isActive = activeId === item.id
            const paddingLeft = (item.level - 2) * 16

            return (
              <li key={item.id} style={{ paddingLeft: `${paddingLeft}px` }}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block py-1 transition-colors hover:text-foreground",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }}
                >
                  {item.text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}