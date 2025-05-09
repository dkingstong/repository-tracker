'use client'

import { GitHubLoginButton } from "@/components/GitHubLoginButton"
import { ArrowRight, Github, Star, GitBranch, Bell } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container px-4 pt-16 pb-12 md:pt-24 md:pb-20 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
            <Bell className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">Never miss important updates</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            GitHub Release Tracker
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Keep track of your favorite GitHub repositories and stay updated on every release, issue, and pull request.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <GitHubLoginButton />
            <button className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Repository Tracking</h3>
            <p className="text-muted-foreground">Follow your favorite repositories and receive customized updates on their activity.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
            <p className="text-muted-foreground">Get intelligent alerts about releases, issues, and pull requests that matter to you.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Dashboard</h3>
            <p className="text-muted-foreground">View all your tracked repositories in one place with advanced filtering options.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground border-t pt-8">
          <p>© {new Date().getFullYear()} GitHub Release Tracker. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  )
} 