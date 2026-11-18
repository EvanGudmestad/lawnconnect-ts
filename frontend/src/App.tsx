import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
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
    </>
  );
}

function ListRoute() {
  const navigate = useNavigate();
  return <ProviderListPage onSelect={(id) => navigate(`/edit/${id}`)} />;
}

export default function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="home" element={<Navigate to="/" replace />} />

      <Route element={<Layout />}>
        <Route path="browse" element={<ListRoute />} />
        <Route path="edit/:id" element={<ProviderEditPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
