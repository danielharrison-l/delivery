import { Component } from "react";
import { Button } from "../ui/button";

export class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-soft">
            <h1 className="text-xl font-semibold">Não foi possível carregar esta página</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Atualize a página ou tente novamente em instantes.</p>
            <Button className="mt-5" onClick={() => window.location.reload()} type="button">
              Recarregar
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
