import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskMind | AI-Powered Task Management - Coming Soon",
  description:
    "Transform how you organize and prioritize your work with intelligent automation, natural language processing, and smart task insights.",
  keywords: ["AI", "task management", "productivity", "automation", "natural language processing"],
  authors: [{ name: "TaskMind Team" }],
  creator: "TaskMind",
  publisher: "TaskMind",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://taskmind.space"),
  openGraph: {
    title: "TaskMind | AI-Powered Task Management",
    description: "Transform how you organize and prioritize your work with intelligent automation and AI.",
    url: "https://taskmind.space",
    siteName: "TaskMind",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaskMind - AI-Powered Task Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskMind | AI-Powered Task Management",
    description: "Transform how you organize and prioritize your work with intelligent automation and AI.",
    creator: "@toygaaar",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
