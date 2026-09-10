import { useEffect, useState } from "react";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceAreaZipCodes: string[];
  servicesOffered: string[];
}

function App() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/providers")
      .then((res) => res.json())
      .then(setProviders)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        <ul>
          {providers.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
