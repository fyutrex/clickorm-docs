"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

interface EditLinkProps {
  filePath?: string
}

export function EditLink({ filePath }: EditLinkProps) {
  if (!filePath) return null

  const githubUrl = `${siteConfig.links.github}/edit/main/clickorm-docs/content/${filePath}`

  return (
    <div className="flex items-center gap-2 pt-8 mt-8 border-t">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        asChild
      >
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4" />
          Edit this page on GitHub
        </a>
      </Button>
    </div>
  )
}