import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section>
      <h2>Page not found</h2>
      <Link to="/">Back to the provider list</Link>
    </section>
  );
}
