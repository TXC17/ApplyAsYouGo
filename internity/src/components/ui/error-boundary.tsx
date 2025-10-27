"use client"

import React from 'react'
import { Button } from './button'
import { Card } from './card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <h2 className="text-xl font-bold text-[#f1eece] mb-4">Something went wrong</h2>
            <p className="text-[#e6e2b1] mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={this.resetError}
                className="w-full bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece]"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full border-[#f1eece]/50 text-[#f1eece] hover:bg-[#f1eece]/10"
              >
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
