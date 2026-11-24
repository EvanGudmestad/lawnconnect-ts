import { NavLink, useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { useAuth } from "../auth/AuthContext";
import { roles } from "../../../src/permissions";
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
  const navigate = useNavigate();
  async function handleSignOut() {
    await authClient.signOut();
    navigate("/sign-in");
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
        <NavLink to="/search" className={linkClass}>
          Find a provider
        </NavLink>
      )}

      {auth.status === "signed-in" && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" variant="ghost" size="sm" />}
          >
            <Avatar className="size-6">
              <AvatarFallback>
                {auth.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {auth.user.name}
            {auth.user.role && auth.user.role in roles
              ? ` (${auth.user.role})`
              : " (no role yet)"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{auth.user.email}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
