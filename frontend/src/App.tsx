import { Outlet, Route, Routes, useNavigate } from "react-router";
import { NavBar } from "./components/NavBar";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProviderEditPage } from "./pages/ProviderEditPage";
import { ProviderListPage } from "./pages/ProviderListPage";

function Layout() {
  return (
    <>
      <header>
        <h1>LawnConnect</h1>
        <NavBar />
      </header>
      <main>
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
      <Route element={<Layout />}>
        <Route index element={<ListRoute />} />
        <Route path="edit/:id" element={<ProviderEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
