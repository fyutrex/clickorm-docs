import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeHighlight from "rehype-highlight"

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "content", "privacy.mdx")
  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContent)

  return (
    <div className="container max-w-4xl py-12">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MDXRemote 
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                rehypeHighlight,
              ],
            },
          }}
        />
      </article>
    </div>
  )
}