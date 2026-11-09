import { useEffect, useState } from "react";
import { ApiError, listProviders } from "../api";
import { ProviderList } from "../components/ProviderList";
import type { Provider } from "../types";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; providers: Provider[] };

export function ProviderListPage() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const providers = await listProviders();
        if (!ignore) setState({ kind: "loaded", providers });
      } catch (err) {
        if (ignore) return;
        setState({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "Could not reach the server",
        });
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  if (state.kind === "loading") return <p role="status">Loading providers…</p>;
  if (state.kind === "error") return <p role="alert">{state.message}</p>;
  if (state.providers.length === 0) return <p>No providers yet.</p>;
  return <ProviderList providers={state.providers} />;
}
