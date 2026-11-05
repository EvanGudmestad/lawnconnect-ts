import { useState } from "react";
import { ProviderList } from "./components/ProviderList.tsx";
import type { Provider } from "./types.ts";
import { AddProviderForm } from "./components/AddProviderForm.tsx";

const sampleData: Provider[] = [
  {
    id: "1",
    name: "Green Acres Mowing",
    email: "hello@greenacres.example",
    serviceAreaZipCodes: ["63101", "63102"],
    servicesOffered: ["Mowing", "Edging"],
  },
  {
    id: "2",
    name: "Edge Masters",
    email: "info@edgemasters.example",
    serviceAreaZipCodes: ["63103"],
    servicesOffered: ["Edging"],
  },
  {
    id: "3",
    name: "Leaf Away",
    email: "crew@leafaway.example",
    serviceAreaZipCodes: ["63101", "63104"],
    servicesOffered: ["LeafCleanup", "Fertilizing"],
  },
];

function App() {
  const [providers, setProviders] = useState<Provider[]>(sampleData);

  function handleDelete(id: string) {
    setProviders((current) => current.filter((p) => p.id !== id));
  }

  function handleAdd(draft: Omit<Provider, "id">) {
    setProviders((current) => [
      ...current,
      { id: crypto.randomUUID(), ...draft },
    ]);
  }

  return (
    <>
      <main>
        <h1>LawnConnect</h1>
        <AddProviderForm onAdd={handleAdd} />
        <ProviderList providers={providers} onDelete={handleDelete} />
      </main>
    </>
  );
}

export default App;
