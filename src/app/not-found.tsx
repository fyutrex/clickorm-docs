import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-2xl px-4 text-center">
        {/* Large 404 */}
        <h1 className="mb-4 text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-neon-pink via-brand-neon-purple to-brand-neon-cyan">
          404
        </h1>
        {/* Description */}
        <p className="mb-8 text-lg text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-brand-neon-pink to-brand-neon-purple hover:opacity-90"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white/20 hover:border-brand-neon-cyan hover:bg-white/5"
          >
            <Link href="/docs" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              View Documentation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}