import { useState } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
    <section className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm">
        Filter by service
        <NativeSelect
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <NativeSelectOption value="all">all</NativeSelectOption>
          {services.map((s) => (
            <NativeSelectOption key={s} value={s}>
              {s}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </label>
      <p className="text-sm text-muted-foreground">
        Showing {shown.length} of {providers.length} providers
      </p>
      {shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">No providers to show.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
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
