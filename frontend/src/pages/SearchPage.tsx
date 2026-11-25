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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, SearchX, Wrench } from "lucide-react";
import { ApiError, searchProviders } from "../api";
import { ProviderCard } from "../components/ProviderCard";
import { pageOrOne, sortOrName } from "../searchParams";
import type { Sort } from "../searchParams";
import type { Provider } from "../types";

// Five to a page, so the demo has a second page without hundreds of providers.
const PAGE_SIZE = 5;

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

type SearchResultsProps = {
  zip: string;
  service: string;
  sort: Sort;
  page: number;
  onPage: (page: number) => void;
  onSelect?: (id: string) => void;
  onUnauthorized?: () => void;
};

// The page gives this component a key built from the whole address, so every
// new address starts a fresh one that begins as loading. The old one is thrown
// away, and its cleanup makes it ignore its late answer.
function SearchResults({
  zip,
  service,
  sort,
  page,
  onPage,
  onSelect,
  onUnauthorized,
}: SearchResultsProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        // The server compares the service exactly, and ours are stored in lowercase.
        const providers = await searchProviders({
          zip,
          service: service.toLowerCase(),
          sort,
          page,
          limit: PAGE_SIZE,
        });
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
  }, [zip, service, sort, page, onUnauthorized]);

  if (state.kind === "loading") {
    return (
      <div
        role="status"
        aria-label="Loading providers"
        className="grid gap-4 sm:grid-cols-2"
      >
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <p role="alert" className="text-sm text-destructive">
        {state.message}
      </p>
    );
  }

  const { providers } = state;
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Page {page}: {providers.length}{" "}
        {providers.length === 1 ? "provider" : "providers"}
      </p>
      {providers.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No providers here</EmptyTitle>
            <EmptyDescription>
              {page > 1
                ? "There is nothing on this page. Try Previous."
                : "Try a different ZIP code or service, or clear one of the boxes."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {providers.map((p) => (
          <li key={p.id}>
            <ProviderCard provider={p} onSelect={onSelect} />
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={providers.length < PAGE_SIZE}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
}

// The address is the single source of truth:
// /search?zip=63101&service=mowing&sort=-name&page=2
export function SearchPage({ onSelect, onUnauthorized }: SearchPageProps) {
  const [params, setParams] = useSearchParams();
  const zip = params.get("zip") ?? "";
  const service = params.get("service") ?? "";
  const sort = sortOrName(params.get("sort"));
  const page = pageOrOne(params.get("page"));

  // Change one or two things in the address and keep the rest. A new filter or
  // sort means a new list, so it goes back to page 1. Only Previous and Next
  // pass keepPage as true.
  function change(changes: Record<string, string>, keepPage = false) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!keepPage) next.delete("page");
    setParams(next);
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Find a provider</h2>
      <SearchForm
        key={`${zip}|${service}`}
        zip={zip}
        service={service}
        onSearch={(nextZip, nextService) =>
          change({ zip: nextZip, service: nextService })
        }
      />
      <label className="flex flex-col gap-1 text-sm sm:w-48">
        Sort by
        <NativeSelect
          value={sort}
          onChange={(e) => change({ sort: e.target.value })}
        >
          <NativeSelectOption value="name">Name A to Z</NativeSelectOption>
          <NativeSelectOption value="-name">Name Z to A</NativeSelectOption>
          <NativeSelectOption value="email">Email A to Z</NativeSelectOption>
          <NativeSelectOption value="-email">Email Z to A</NativeSelectOption>
        </NativeSelect>
      </label>
      <SearchResults
        key={`${zip}|${service}|${sort}|${page}`}
        zip={zip}
        service={service}
        sort={sort}
        page={page}
        onPage={(nextPage) =>
          change({ page: nextPage === 1 ? "" : String(nextPage) }, true)
        }
        onSelect={onSelect}
        onUnauthorized={onUnauthorized}
      />
    </section>
  );
}
