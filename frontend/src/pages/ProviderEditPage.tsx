import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ApiError, getProvider, updateProvider } from "../api";
import type { ProviderDraft } from "../api";
import { AddProviderForm } from "../components/AddProviderForm";
import type { Provider } from "../types";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; provider: Provider };

export function ProviderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    //setState({ kind: 'loading' })
    const load = async () => {
      try {
        const provider = await getProvider(id);
        if (!ignore) setState({ kind: "loaded", provider });
      } catch (err) {
        if (!ignore)
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
  }, [id]);

  async function handleSave(draft: ProviderDraft) {
    if (!id) return;
    await updateProvider(id, draft);
    navigate("/");
  }

  return (
    <section>
      <h2>Edit provider</h2>
      <Link to="/">Back to all providers</Link>
      {state.kind === "loading" && <p role="status">Loading provider…</p>}
      {state.kind === "error" && <p role="alert">{state.message}</p>}
      {state.kind === "loaded" && (
        <AddProviderForm
          onAdd={handleSave}
          initial={state.provider}
          submitLabel="Save changes"
          clearOnSuccess={false}
        />
      )}
    </section>
  );
}
