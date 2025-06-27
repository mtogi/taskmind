"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronRight,
  Github,
  Mail,
  Smartphone,
  Star,
  Target,
  Twitter,
  Zap,
  BarChart3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Moving Stars Component - Client Only
const MovingStars = () => {
  const [mounted, setMounted] = useState(false)
  const [stars, setStars] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    setMounted(true)
    // Generate stars only on client side with a fixed seed for consistency
    const generateStars = () => {
      const seed = 12345 // Fixed seed for consistent generation
      const stars = []
      
      for (let i = 0; i < 50; i++) {
        // Simple seeded random function
        const x = ((i * 9301 + 49297) % 233280) / 233280 * 100
        const y = ((i * 49297 + 9301) % 233280) / 233280 * 100
        const size = ((i * 49297 + 49297) % 233280) / 233280 * 3 + 1
        const duration = ((i * 9301 + 9301) % 233280) / 233280 * 20 + 10
        const delay = ((i * 49297 + 9301) % 233280) / 233280 * 5
        
        stars.push({
          id: i,
          x,
          y,
          size,
          duration,
          delay,
        })
      }
      
      return stars
    }
    
    setStars(generateStars())
  }, [])

  if (!mounted) {
    return null // Don't render anything on server
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            y: ["-10vh", "120vh"],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default function Landing() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentYear, setCurrentYear] = useState("")

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString())
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "You're on the list! 🎉",
      description: "We'll notify you when TaskMind launches.",
    })

    setEmail("")
    setIsSubmitting(false)
  }

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Processing",
      description: "Create tasks using natural language and let AI understand context automatically.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Smart Task Breakdown",
      description: "Complex projects automatically broken down into manageable steps.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Intelligent Prioritization",
      description: "AI-driven priority recommendations based on your work patterns.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Cross-Platform Sync",
      description: "Seamless experience across all your devices with real-time sync.",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Moving Stars Effect */}
      <MovingStars />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-400">
                TaskMind
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2 rounded-lg transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
              <ThemeToggle />
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-background"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>

          {/* Additional twinkling stars */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-32 left-1/3 w-1 h-1 bg-foreground rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-40 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <motion.div style={{ opacity, scale }} className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="block">AI-Powered</span>
              <span className="block mt-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-400">
                Task Management
              </span>
            </h1>

            <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform how you organize and prioritize your work with intelligent automation, natural language
              processing, and smart task insights.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>Natural Language Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>AI-Powered Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span>Smart Prioritization</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white px-8 py-6 text-lg h-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="border-border hover:bg-accent text-foreground px-8 py-6 text-lg h-auto"
                >
                  Try Demo
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex justify-center">
              <div className="animate-bounce">
                <ChevronRight className="h-8 w-8 rotate-90 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of task management with AI-powered features designed to boost your productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border p-6 rounded-xl hover:bg-accent/10 transition-colors text-center"
              >
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-400">
                TaskMind
              </span>
            </div>

            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <a href="mailto:mtoygarby@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/mtogi/taskmind"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/toygaaar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm">© {currentYear} TaskMind. All rights reserved.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Built with ❤️ for productivity enthusiasts.</p>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
