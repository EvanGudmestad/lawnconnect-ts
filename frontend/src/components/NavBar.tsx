import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../auth/AuthContext";
import { authClient } from "../lib/authClient";

function linkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-md px-2 py-1 text-sm",
    isActive
      ? "bg-muted font-medium"
      : "text-muted-foreground hover:text-foreground",
  );
}

// On a phone the links stack. From the "sm" width up they sit in a row.
export function NavBar() {
  const auth = useAuth();

  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <nav
      aria-label="Main"
      className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4"
    >
      {auth.status === "signed-in" && (
        <NavLink to="/browse" end className={linkClass}>
          Providers
        </NavLink>
      )}
      {auth.status === "signed-in" && (
        <span className="px-2 text-sm text-muted-foreground">
          {auth.user.name}
          {auth.user.role ? ` (${auth.user.role})` : " (no role yet)"}
        </span>
      )}
      {auth.status === "signed-in" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      )}
      {auth.status === "signed-out" && (
        <NavLink to="/sign-in" className={linkClass}>
          Sign in
        </NavLink>
      )}
      {auth.status === "signed-out" && (
        <NavLink to="/sign-up" className={linkClass}>
          Sign up
        </NavLink>
      )}
    </nav>
  );
}
