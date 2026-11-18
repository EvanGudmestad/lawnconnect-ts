/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { authClient } from "../lib/authClient";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type AuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: CurrentUser };

export const AuthContext = createContext<AuthState>({ status: "loading" });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();

  let value: AuthState;
  if (isPending) {
    value = { status: "loading" };
  } else if (data) {
    value = {
      status: "signed-in",
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role ?? undefined,
      },
    };
  } else {
    value = { status: "signed-out" };
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
