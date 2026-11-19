import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === "loading") {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Checking your sign-in…
      </p>
    );
  }
  if (auth.status === "signed-out") {
    return (
      <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
    );
  }
  return <Outlet />;
}
