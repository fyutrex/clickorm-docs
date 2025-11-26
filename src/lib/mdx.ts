import fs from "fs"
import path from "path"
import matter from "gray-matter"

const contentDirectory = path.join(process.cwd(), "content")

export interface DocMetadata {
  title: string
  description?: string
  [key: string]: any
}

export interface DocContent {
  content: string
  metadata: DocMetadata
  slug: string
}

export function getDocContent(slug: string[]): DocContent | null {
  const slugPath = slug.length === 0 ? ["index"] : slug
  const filePath = path.join(contentDirectory, "docs", ...slugPath) + ".mdx"
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContent)
    
    return {
      content,
      metadata: data as DocMetadata,
      slug: slugPath.join("/"),
    }
  } catch (error) {
    console.error("Error reading MDX file:", error)
    return null
  }
}

export function getAllDocs(): string[] {
  const docsDirectory = path.join(contentDirectory, "docs")
  
  function traverseDirectory(dir: string, basePath: string = ""): string[] {
    const files: string[] = []
    
    try {
      const items = fs.readdirSync(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          files.push(...traverseDirectory(fullPath, path.join(basePath, item)))
        } else if (item.endsWith(".mdx")) {
          const slug = path.join(basePath, item.replace(/\.mdx$/, ""))
          files.push(slug.replace(/\\/g, "/"))
        }
      }
    } catch (error) {
      console.error("Error traversing directory:", error)
    }
    
    return files
  }
  
  return traverseDirectory(docsDirectory)
}