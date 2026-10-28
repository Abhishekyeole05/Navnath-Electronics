import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: '#f8fafc',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
              The application encountered an issue rendering this section. You can refresh or return to the home page.
            </p>
            {this.state.error?.message && (
              <pre style={{
                background: '#f1f5f9',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#dc2626',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '24px'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  fontWeight: 600,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                style={{
                  padding: '10px 20px',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

