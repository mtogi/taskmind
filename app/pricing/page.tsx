"use client"

import { useState } from "react"
import Link from "next/link"
import { Brain, Check, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const handleBillingCycleChange = (value: string) => {
    setBillingCycle(value as "monthly" | "yearly")
  }

  const features = {
    free: [
      "Up to 3 projects",
      "Up to 10 tasks per project",
      "Basic task management",
      "Email support",
    ],
    pro: [
      "Unlimited projects",
      "Unlimited tasks",
      "Advanced AI task suggestions",
      "Task prioritization",
      "Detailed analytics",
      "Team collaboration (up to 3 members)",
      "Priority support",
    ],
    enterprise: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced reporting",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom contract",
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Brain className="h-6 w-6 text-primary" />
          <span className="text-xl tracking-tight">TaskMind</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-foreground hover:text-muted-foreground"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that's right for you and start getting more done with TaskMind.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <Tabs defaultValue="monthly" className="w-full" onValueChange={handleBillingCycleChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:gap-12 mt-8">
            {/* Free Plan */}
            <Card className="flex flex-col">
              <CardHeader className="flex flex-col space-y-1.5">
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/ forever</span>
                </div>
                <Button asChild variant="outline">
                  <Link href="/register">Get Started</Link>
                </Button>
                <div className="grid gap-2 mt-4">
                  {features.free.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col border-primary">
              <CardHeader className="flex flex-col space-y-1.5 bg-primary/10 rounded-t-lg">
                <div className="px-4 py-1 -mt-6 -mx-6 mb-2 bg-primary text-primary-foreground text-sm font-medium rounded-t-lg w-fit">
                  Most Popular
                </div>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>Perfect for individuals and small teams</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${billingCycle === "monthly" ? "12" : "9.60"}
                  </span>
                  <span className="text-muted-foreground">/ month</span>
                </div>
                <Button asChild>
                  <Link href="/register">Start 14-day Free Trial</Link>
                </Button>
                <div className="grid gap-2 mt-4">
                  {features.pro.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 text-xs text-muted-foreground">
                No credit card required for trial
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="flex flex-col">
              <CardHeader className="flex flex-col space-y-1.5">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For organizations with advanced needs</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
                <div className="grid gap-2 mt-4">
                  {features.enterprise.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Have questions? <Link href="/contact" className="font-medium text-primary hover:underline">Contact our team</Link>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 