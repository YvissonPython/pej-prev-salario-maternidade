import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export type ConsentChoice = "metrics" | "essential";
export const CONSENT_KEY = "pj_cookie_consent";
export const consentAllowsMetrics = () => localStorage.getItem(CONSENT_KEY) === "metrics";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!localStorage.getItem(CONSENT_KEY));
    const reopen = () => setOpen(true);
    window.addEventListener("pj:cookie-preferences", reopen);
    return () => window.removeEventListener("pj:cookie-preferences", reopen);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "metrics");
    window.dispatchEvent(new CustomEvent("pj:consent-changed", { detail: "metrics" }));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card/98 p-5 shadow-card-hover backdrop-blur-md sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="cookie-title" className="font-serif text-base font-semibold text-foreground">
            Privacidade e cookies
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Utilizamos cookies essenciais e métricas para garantir o funcionamento do site e aprimorar sua experiência.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <Link
          to="/politica-de-privacidade"
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-medium text-primary transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
        >
          Ver políticas
        </Link>
        <button
          type="button"
          onClick={accept}
          className="min-h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-button transition-all hover:bg-primary/92 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Aceitar
        </button>
      </div>
    </aside>
  );
}
