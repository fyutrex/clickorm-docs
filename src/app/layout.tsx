import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalLayout } from "@/components/conditional-layout"

// Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ClickORM Documentation",
  description: "TypeScript ORM for ClickHouse with intuitive query building",
  keywords: ["ClickHouse", "ORM", "TypeScript", "Database", "Query Builder"],
  authors: [{ name: "ClickORM Team" }],
  creator: "ClickORM Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "ClickORM Documentation",
    description: "TypeScript ORM for ClickHouse with intuitive query building",
    siteName: "ClickORM",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickORM Documentation",
    description: "TypeScript ORM for ClickHouse with intuitive query building",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}