import type { Provider } from "../types";

type ProviderCardProps = {
  provider: Provider;
};

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article>
      <h3>{provider.name}</h3>
      <p>Offers {provider.servicesOffered.join(", ")}</p>
      <p>Serves Zip Codes: {provider.serviceAreaZipCodes.join(", ")}</p>
    </article>
  );
}
