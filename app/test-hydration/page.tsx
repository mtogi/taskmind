"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function TestHydrationPage() {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Client-side rendering...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Hydration Test</h1>
        <p className="text-muted-foreground mb-4">
          This page tests if hydration issues are resolved.
        </p>
        <div className="mb-4">
          <p>Count: {count}</p>
          <Button onClick={() => setCount(count + 1)} className="mt-2">
            Increment
          </Button>
        </div>
        <p className="text-sm text-green-600">
          ✓ If you can see this without console errors, hydration is working correctly!
        </p>
      </div>
    </div>
  )
} 