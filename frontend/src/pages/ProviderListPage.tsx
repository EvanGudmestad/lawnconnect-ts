import { useEffect, useState } from "react";
import {
  ApiError,
  createProvider,
  deleteProvider,
  listProviders,
} from "../api";
import type { ProviderDraft } from "../api";
import { ProviderForm } from "../components/ProviderForm";
import { ProviderList } from "../components/ProviderList";
import type { Provider } from "../types";
import { notify } from "../lib/notify";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; providers: Provider[] };

const messageFor = (err: unknown) =>
  err instanceof ApiError ? err.message : "Could not reach the server";

type ProviderListPageProps = {
  onSelect?: (id: string) => void;
  onUnauthorized?: () => void;
  canCreate?: boolean;
  canDelete?: boolean;
};

export function ProviderListPage({
  onSelect,
  onUnauthorized,
  canCreate = true,
  canDelete = true,
}: ProviderListPageProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const providers = await listProviders();
        if (!ignore) setState({ kind: "loaded", providers });
      } catch (err) {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 401 && onUnauthorized) {
          onUnauthorized();
          return;
        }
        setState({ kind: "error", message: messageFor(err) });
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [onUnauthorized]);

  function replace(change: (providers: Provider[]) => Provider[]) {
    setState((cur) =>
      cur.kind === "loaded"
        ? { kind: "loaded", providers: change(cur.providers) }
        : cur,
    );
  }

  async function handleAdd(draft: ProviderDraft) {
    const created = await createProvider(draft);
    replace((providers) => [...providers, created]);
    notify("Provider added");
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteProvider(id);
      replace((providers) => providers.filter((p) => p.id !== id));
      notify("Provider deleted");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }

      setActionError(messageFor(err));
    }
  }

  if (state.kind === "loading") return <p role="status">Loading providers…</p>;
  if (state.kind === "error") return <p role="alert">{state.message}</p>;

  return (
    <div className="flex flex-col gap-6">
      {canCreate && <ProviderForm onSave={handleAdd} />}
      {actionError && <p role="alert">{actionError}</p>}

      {state.providers.length === 0 ? (
        <p>No providers yet. Add the first one.</p>
      ) : (
        <ProviderList
          providers={state.providers}
          onSelect={onSelect}
          onDelete={canDelete ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
