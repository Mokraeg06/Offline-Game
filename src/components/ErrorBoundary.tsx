import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: '#0f172a', color: '#f1f5f9',
          minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px', fontFamily: 'monospace', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ color: '#f87171', marginBottom: 12, fontSize: 20 }}>Fehler beim Laden</h1>
          <pre style={{
            background: '#1e293b', padding: 16, borderRadius: 8,
            fontSize: 13, color: '#fbbf24', maxWidth: 480,
            overflowX: 'auto', textAlign: 'left', whiteSpace: 'pre-wrap',
          }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 24, padding: '10px 24px', background: '#7c3aed',
              color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15,
            }}
          >
            Neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
