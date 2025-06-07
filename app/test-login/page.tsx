"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function TestLoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTestLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await login("test@taskmind.dev", "testpassword123")
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Test Login Page</h1>
      
      {user ? (
        <div className="bg-green-50 p-4 rounded-md mb-4">
          <p className="text-green-700 font-medium">Already logged in as:</p>
          <p>{user.name} ({user.email})</p>
          <button 
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={handleTestLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in with Test Account"}
          </button>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            <p className="font-medium">Test Account Credentials:</p>
            <p>Email: test@taskmind.dev</p>
            <p>Password: testpassword123</p>
          </div>
        </div>
      )}
    </div>
  )
} 