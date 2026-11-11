import { NavLink } from "react-router";

export function NavBar() {
  return (
    <nav aria-label="Main">
      <NavLink to="/" end>
        Providers
      </NavLink>
    </nav>
  );
}
