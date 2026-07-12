import { Component, type ErrorInfo, type ReactNode } from "react";
<<<<<<< HEAD
interface Props { children: ReactNode } interface State { error: Error | null }
export class ErrorBoundary extends Component<Props, State> { state: State = { error: null }; static getDerivedStateFromError(error: Error): State { return { error }; } componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error(error, errorInfo); } render(){ if(this.state.error){ return <div className="min-h-screen bg-zinc-950 p-6 text-zinc-50"><div className="rounded-xl border border-red-900/60 bg-red-950/40 p-5"><h1 className="text-lg font-semibold text-red-200">Something went wrong</h1><pre className="mt-3 whitespace-pre-wrap text-sm text-red-100">{this.state.error.message}</pre></div></div>; } return this.props.children; }}
=======

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    console.error("Image Toolkit crashed:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-zinc-950 p-6 text-zinc-50">
          <div className="rounded-xl border border-red-900/70 bg-red-950/40 p-4">
            <h1 className="text-lg font-semibold text-red-200">
              Image Toolkit crashed
            </h1>

            <p className="mt-2 text-sm text-red-100">
              The frontend encountered a runtime error.
            </p>

            <pre className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-black p-4 text-xs text-red-300">
              {this.state.error.message}
            </pre>

            {this.state.errorInfo && (
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black p-4 text-xs text-zinc-400">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
