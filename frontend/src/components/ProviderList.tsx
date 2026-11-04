import type { Provider } from "../types";
import { ProviderCard } from "./ProviderCard";

type ProviderListProps = {
  providers: Provider[];
};

export function ProviderList({ providers }: ProviderListProps) {
  return (
    <section>
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </section>
  );
}
