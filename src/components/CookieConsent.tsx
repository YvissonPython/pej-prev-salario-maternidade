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
      className="cookie-consent fixed inset-x-3 z-[100] mx-auto max-w-3xl rounded-xl border border-border/80 bg-card/98 shadow-card-hover backdrop-blur-md sm:inset-x-6"
    >
      <div className="cookie-consent-copy flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="cookie-title" className="font-serif text-sm font-semibold text-foreground sm:text-base">
            Privacidade e cookies
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Usamos cookies essenciais e métricas para melhorar sua experiência.
          </p>
        </div>
      </div>
      <div className="cookie-consent-actions flex items-center gap-2">
        <Link
          to="/politica-de-privacidade"
          className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-medium text-primary transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:text-sm"
        >
          Ver políticas
        </Link>
        <button
          type="button"
          onClick={accept}
          className="min-h-10 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-button transition-all hover:bg-primary/92 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-5 sm:text-sm"
        >
          Aceitar
        </button>
      </div>
    </aside>
  );
}
