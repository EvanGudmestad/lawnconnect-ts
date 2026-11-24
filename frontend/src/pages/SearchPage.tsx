import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, SearchX, Wrench } from "lucide-react";
import { ApiError, listProviders } from "../api";
import { ProviderCard } from "../components/ProviderCard";
import type { Provider } from "../types";

type SearchPageProps = {
  onSelect?: (id: string) => void;
  onUnauthorized?: () => void;
};
type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; providers: Provider[] };

type SearchFormProps = {
  zip: string;
  service: string;
  onSearch: (zip: string, service: string) => void;
};

// The boxes hold what the person is typing.
// The page gives this form a key built from the address, so when the
// address changes (Search, Back, a pasted link) React starts a fresh form.
function SearchForm({ zip, service, onSearch }: SearchFormProps) {
  const [draftZip, setDraftZip] = useState(zip);
  const [draftService, setDraftService] = useState(service);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(draftZip.trim(), draftService.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        ZIP code
        <InputGroup>
          <InputGroupAddon>
            <MapPin />
          </InputGroupAddon>
          <InputGroupInput
            value={draftZip}
            onChange={(e) => setDraftZip(e.target.value)}
          />
        </InputGroup>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Service
        <InputGroup>
          <InputGroupAddon>
            <Wrench />
          </InputGroupAddon>
          <InputGroupInput
            value={draftService}
            onChange={(e) => setDraftService(e.target.value)}
          />
        </InputGroup>
      </label>
      <Button type="submit">Search</Button>
    </form>
  );
}

// The address is the single source of truth: /search?zip=63101&service=Mowing
export function SearchPage({ onSelect, onUnauthorized }: SearchPageProps) {
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const zip = params.get("zip") ?? "";
  const service = params.get("service") ?? "";

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
  }, [onUnauthorized]);

  function handleSearch(nextZip: string, nextService: string) {
    const next = new URLSearchParams();
    if (nextZip) next.set("zip", nextZip);
    if (nextService) next.set("service", nextService);
    setParams(next);
  }

  const matches =
    state.kind === "loaded"
      ? state.providers.filter(
          (p) =>
            (zip === "" || p.serviceAreaZipCodes.includes(zip)) &&
            (service === "" ||
              p.servicesOffered.some(
                (s) => s.toLowerCase() === service.toLowerCase(),
              )),
        )
      : [];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Find a provider</h2>
      <SearchForm
        key={`${zip}|${service}`}
        zip={zip}
        service={service}
        onSearch={handleSearch}
      />
      {state.kind === "loading" && (
        <div
          role="status"
          aria-label="Loading providers"
          className="grid gap-4 sm:grid-cols-2"
        >
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      )}
      {state.kind === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      {state.kind === "loaded" && (
        <>
          <p className="text-sm text-muted-foreground">
            {matches.length} providers match
          </p>
          {matches.length === 0 && (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX />
                </EmptyMedia>
                <EmptyTitle>No providers match</EmptyTitle>
                <EmptyDescription>
                  Try a different ZIP code or service, or clear one of the
                  boxes.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <ul className="grid gap-4 sm:grid-cols-2">
            {matches.map((p) => (
              <li key={p.id}>
                <ProviderCard provider={p} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
