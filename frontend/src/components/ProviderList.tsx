import { useState } from "react";
import type { Provider } from "../types";
import { ProviderCard } from "./ProviderCard";

type ProviderListProps = {
  providers: Provider[];
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ProviderList({
  providers,
  onSelect,
  onDelete,
}: ProviderListProps) {
  const [service, setService] = useState("all");
  const services = [
    ...new Set(providers.flatMap((p) => p.servicesOffered)),
  ].sort();
  const shown =
    service === "all"
      ? providers
      : providers.filter((p) => p.servicesOffered.includes(service));

  return (
    <section>
      <label>
        Filter by service{" "}
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="all">all</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <p>
        Showing {shown.length} of {providers.length} providers
      </p>
      {shown.length === 0 ? (
        <p>No providers to show.</p>
      ) : (
        <ul>
          {shown.map((p) => (
            <li key={p.id}>
              <ProviderCard
                provider={p}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
