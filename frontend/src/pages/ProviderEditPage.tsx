import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ApiError, getProvider, updateProvider } from "../api";
import type { ProviderDraft } from "../api";
import { ProviderForm, toFormValues } from "../components/ProviderForm";
import type { Provider } from "../types";
import { useExpiredSession } from "../auth/useExpiredSession";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; provider: Provider };

export function ProviderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handleExpired = useExpiredSession();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    const load = async () => {
      try {
        const provider = await getProvider(id);
        if (!ignore) setState({ kind: "loaded", provider });
      } catch (err) {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 401) {
          void handleExpired();
          return;
        }
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
  }, [id, handleExpired]);

  async function handleSave(draft: ProviderDraft) {
    if (!id) return;
    await updateProvider(id, draft);
    navigate("/browse");
  }

  return (
    <section>
      <h2>Edit provider</h2>
      <Link to="/browse">Back to all providers</Link>
      {state.kind === "loading" && <p role="status">Loading provider…</p>}
      {state.kind === "error" && <p role="alert">{state.message}</p>}
      {state.kind === "loaded" && (
        <ProviderForm
          onSave={handleSave}
          initial={toFormValues(state.provider)}
          submitLabel="Save changes"
          clearOnSuccess={false}
        />
      )}
    </section>
  );
}
