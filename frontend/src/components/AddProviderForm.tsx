import { useState } from "react";
import type { Provider } from "../types";

type AddProviderFormProps = {
  onAdd: (provider: Omit<Provider, "id">) => void;
};

const splitList = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

export function AddProviderForm({ onAdd }: AddProviderFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zips, setZips] = useState("");
  const [services, setServices] = useState("");
  const [problems, setProblems] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: string[] = [];
    if (name.trim() === "") found.push("Name is required");
    if (!email.includes("@")) found.push("Email must contain an @");
    setProblems(found);
    if (found.length > 0) return;

    onAdd({
      name: name.trim(),
      email: email.trim(),
      serviceAreaZipCodes: splitList(zips),
      servicesOffered: splitList(services),
    });
    setName("");
    setEmail("");
    setZips("");
    setServices("");
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
      <button type="submit">Add provider</button>
    </form>
  );
}
