import { ReactNode } from "react"

interface MdxComponentProps {
  children?: ReactNode
  [key: string]: any
}

export const mdxComponents = {
  h1: ({ children, ...props }: MdxComponentProps) => (
    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MdxComponentProps) => (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: MdxComponentProps) => (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: MdxComponentProps) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
      {children}
    </p>
  ),
  code: ({ children, ...props }: MdxComponentProps) => (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props}>
      {children}
    </code>
  ),
}