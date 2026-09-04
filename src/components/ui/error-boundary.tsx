"use client";

import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex h-[50vh] w-full items-center justify-center px-4">
          <Card className="w-full max-w-md border-destructive/30 bg-card">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">
                  We encountered an unexpected error. Please try again.
                </p>
                {this.state.error && (
                  <details className="text-xs text-muted-foreground/70 text-left w-full max-w-xs">
                    <summary className="cursor-pointer">Error details</summary>
                    <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-left">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
              <Button onClick={this.handleRetry} className="gap-2">
                <RefreshCw className="size-4" />
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}