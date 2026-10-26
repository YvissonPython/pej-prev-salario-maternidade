import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index.tsx";

const Admin = lazy(() => import("./pages/Admin.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse.tsx"));
const ThankYou = lazy(() => import("./pages/ThankYou.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-label="Carregando página">
    <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos-de-uso" element={<TermsOfUse />} />
        <Route path="/obrigado" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <CookieConsent />
  </BrowserRouter>
);

export default App;
