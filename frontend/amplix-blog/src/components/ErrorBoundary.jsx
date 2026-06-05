import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary atrapó un error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-6xl text-error mb-4 block">
              error
            </span>
            <h1 className="text-2xl font-bold text-on-surface mb-2">
              Algo salió mal
            </h1>
            <p className="text-on-surface-variant mb-8">
              Ocurrió un error inesperado en la aplicación.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full font-bold text-on-primary bg-primary hover:bg-on-primary-fixed-variant transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}