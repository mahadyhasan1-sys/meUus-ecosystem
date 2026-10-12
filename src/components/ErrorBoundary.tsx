/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ErrorBoundary — Graceful fallback for lazy-loaded sections and unexpected React errors.
 * Prevents a single component failure from crashing the entire meUus OS surface.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  sectionName?: string;
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[meUus ErrorBoundary] ${this.props.sectionName || 'Section'} crashed:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-8 px-6">
          <div className="max-w-md text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {this.props.sectionName || 'This section'} encountered an issue
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              This section failed to load. This may be due to a network issue or temporary error. 
              Your other sections are unaffected.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            {this.state.error && (
              <details className="text-left mt-4">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-500">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-red-400/80 bg-white rounded-lg p-3 overflow-auto max-h-32 border border-gray-200">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
