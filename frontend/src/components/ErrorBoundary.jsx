import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Sentry, LogRocket, etc.
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              {/* Error Message */}
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. This might be a temporary issue.
              </p>
              
              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg text-sm">
                  <summary className="cursor-pointer text-gray-700 font-medium mb-2">
                    Error details (dev mode)
                  </summary>
                  <div className="text-gray-600 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="text-xs mt-1 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              {/* Actions */}
              <div className="space-y-3">
                {this.state.retryCount < 3 && (
                  <button 
                    onClick={this.handleRetry}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                )}
                
                <button 
                  onClick={this.handleReload}
                  className="btn-secondary w-full"
                >
                  Reload Page
                </button>
                
                <a 
                  href="/"
                  className="btn-ghost w-full"
                >
                  Go to Home
                </a>
              </div>
              
              {/* Retry Counter */}
              {this.state.retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  Retry attempts: {this.state.retryCount}/3
                </p>
              )}
            </div>
            
            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                If the problem persists, please try refreshing the page or{' '}
                <a 
                  href="https://github.com/tempforms/tempforms/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  report the issue
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;