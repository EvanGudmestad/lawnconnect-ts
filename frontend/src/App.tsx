import { ProviderList } from "./components/ProviderList.tsx";
import type { Provider } from "./types.ts";

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
  return (
    <>
      <main>
        <h1>LawnConnect</h1>
        <ProviderList providers={sampleData} />
      </main>
    </>
  );
}

export default App;
