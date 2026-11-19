import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { Toaster } from "@/components/ui/toast";
import { RequireAuth } from "./auth/RequireAuth";
import { useAuth } from "./auth/AuthContext";
import { useExpiredSession } from "./auth/useExpiredSession";
import { roles, type RoleName } from "../../src/permissions";
import { authClient } from "./lib/authClient";

import { NavBar } from "./components/NavBar";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LandingPage } from "./pages/LandingPage";
import { ProviderEditPage } from "./pages/ProviderEditPage";
import { ProviderListPage } from "./pages/ProviderListPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

function Layout() {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">
            <Link to="/">LawnConnect</Link>
          </h1>

          <NavBar />
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}

function ListRoute() {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleExpired = useExpiredSession();
  const role = auth.status === "signed-in" ? auth.user.role : undefined;
  const known = role !== undefined && role in roles;
  const canCreate =
    known &&
    authClient.admin.checkRolePermission({
      role: role as RoleName,
      permissions: { provider: ["create"] },
    });
  const canDelete =
    known &&
    authClient.admin.checkRolePermission({
      role: role as RoleName,
      permissions: { provider: ["delete"] },
    });
  return (
    <>
      {!known && (
        <p className="mb-4 rounded-md border p-3 text-sm text-muted-foreground">
          You are signed in, but your account has no role yet, so you can look
          but not change anything.
        </p>
      )}
      <ProviderListPage
        onSelect={(id) => navigate(`/edit/${id}`)}
        onUnauthorized={handleExpired}
        canCreate={canCreate}
        canDelete={canDelete}
      />
    </>
  );

  //return <ProviderListPage onSelect={(id) => navigate(`/edit/${id}`)} />;
}

export default function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="home" element={<Navigate to="/" replace />} />

      <Route element={<Layout />}>
        <Route element={<RequireAuth />}>
          <Route path="browse" element={<ListRoute />} />
          <Route path="edit/:id" element={<ProviderEditPage />} />
        </Route>

        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
