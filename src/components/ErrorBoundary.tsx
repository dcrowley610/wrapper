import { Component, type ErrorInfo, type PropsWithChildren } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 28,
          borderRadius: 16,
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          margin: 28,
        }}>
          <h2 style={{ margin: '0 0 8px' }}>Something went wrong</h2>
          <p style={{ margin: 0, color: '#b91c1c' }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
