import { useState } from "react";
import { ApiError } from "../api";
import type { ProviderDraft } from "../api";

type AddProviderFormProps = {
  onAdd: (provider: ProviderDraft) => Promise<void>;
  initial?: ProviderDraft;
  submitLabel?: string;
  clearOnSuccess?: boolean;
};

const splitList = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

export function AddProviderForm({
  onAdd,
  initial,
  submitLabel = "Add provider",
  clearOnSuccess = true,
}: AddProviderFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [zips, setZips] = useState(
    initial?.serviceAreaZipCodes.join(", ") ?? "",
  );
  const [services, setServices] = useState(
    initial?.servicesOffered.join(", ") ?? "",
  );
  const [problems, setProblems] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: string[] = [];
    if (name.trim() === "") found.push("Name is required");
    if (!email.includes("@")) found.push("Email must contain an @");
    setProblems(found);
    if (found.length > 0) return;

    setBusy(true);
    try {
      await onAdd({
        name: name.trim(),
        email: email.trim(),
        serviceAreaZipCodes: splitList(zips),
        servicesOffered: splitList(services),
      });
      if (clearOnSuccess) {
        setName("");
        setEmail("");
        setZips("");
        setServices("");
      }
    } catch (err) {
      setProblems([
        err instanceof ApiError ? err.message : "Could not reach the server",
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p>
        <label>
          Name <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
      <p>
        <label>
          Email{" "}
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </p>
      <p>
        <label>
          ZIP codes served (separate with commas){" "}
          <input value={zips} onChange={(e) => setZips(e.target.value)} />
        </label>
      </p>
      <p>
        <label>
          Services offered (separate with commas){" "}
          <input
            value={services}
            onChange={(e) => setServices(e.target.value)}
          />
        </label>
      </p>
      {problems.length > 0 && (
        <ul role="alert">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={busy}>
        {submitLabel}
      </button>
    </form>
  );
}
