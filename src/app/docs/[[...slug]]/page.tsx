import { notFound } from "next/navigation"
import { EditLink } from "@/components/docs/edit-link"
import { getDocContent, getAllDocs } from "@/lib/mdx"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeHighlight from "rehype-highlight"

interface DocPageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params
  const slugArray = slug || []
  const docData = getDocContent(slugArray)

  if (!docData) {
    notFound()
  }

  const filePath = `docs/${slugArray.join("/") || "index"}.mdx`

  return (
    <div className="max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1>{docData.metadata.title}</h1>
        {docData.metadata.description && (
          <p className="text-xl text-muted-foreground">{docData.metadata.description}</p>
        )}
        <MDXRemote
          source={docData.content}
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
      <div className="mt-12">
        <EditLink filePath={filePath} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  
  return docs.map((slug) => ({
    slug: slug === "index" ? [] : slug.split("/"),
  }))
}