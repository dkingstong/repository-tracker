'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-6">
          There was a problem authenticating with GitHub.
        </p>
        <Button asChild>
          <Link href="/">
            Try Again
          </Link>
        </Button>
      </div>
    </div>
  )
} 