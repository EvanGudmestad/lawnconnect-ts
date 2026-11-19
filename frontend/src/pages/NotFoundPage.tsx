import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="flex flex-col gap-4">
      <h2>Page not found</h2>
      <p>There is no screen at this address.</p>
      <Link to="/browse">Back to the provider list</Link>
    </section>
  );
}
