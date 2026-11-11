import { useState } from "react";
import type { Provider } from "../types";

type ProviderCardProps = {
  provider: Provider;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ProviderCard({
  provider,
  onSelect,
  onDelete,
}: ProviderCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <article>
      <h3>{provider.name}</h3>
      <p>Offers {provider.servicesOffered.join(", ")}</p>
      <p>Serves {provider.serviceAreaZipCodes.join(", ")}</p>
      {onSelect && (
        <button type="button" onClick={() => onSelect(provider.id)}>
          View
        </button>
      )}
      {onDelete && !confirming && (
        <button type="button" onClick={() => setConfirming(true)}>
          Delete
        </button>
      )}
      {onDelete && confirming && (
        <span>
          Delete this listing?{" "}
          <button type="button" onClick={() => onDelete(provider.id)}>
            Yes, delete
          </button>{" "}
          <button type="button" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </span>
      )}
    </article>
  );
}
