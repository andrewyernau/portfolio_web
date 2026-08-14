import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PublicationsPage } from "./pages/PublicationsPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/es" replace />} />
      <Route path="/:locale" element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="publicaciones" element={<PublicationsPage />} />
        <Route path="publications" element={<PublicationsPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/es" replace />} />
    </Routes>
  );
}
