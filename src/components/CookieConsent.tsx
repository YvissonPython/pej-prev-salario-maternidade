import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

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
  const choose = (choice: ConsentChoice) => {
    localStorage.setItem(CONSENT_KEY, choice);
    window.dispatchEvent(new CustomEvent("pj:consent-changed", { detail: choice }));
    setOpen(false);
  };
  if (!open) return null;
  return (
    <aside role="dialog" aria-label="Preferências de cookies" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 p-5 shadow-card-hover backdrop-blur-xl sm:bottom-6 sm:p-6">
      <button onClick={() => setOpen(false)} aria-label="Fechar" className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button>
      <div className="flex gap-4 pr-8"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Cookie className="h-5 w-5" /></span><div><h2 className="font-serif font-semibold text-foreground">Sua privacidade importa</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Usamos recursos essenciais para o site funcionar. Métricas opcionais ajudam a melhorar a experiência e só serão ativadas com sua escolha.</p></div></div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"><button onClick={() => choose("metrics")} className="min-h-11 rounded-xl bg-primary px-5 font-semibold text-primary-foreground">Aceitar métricas</button><button onClick={() => choose("essential")} className="min-h-11 rounded-xl border border-border px-5 font-medium text-foreground hover:bg-secondary">Somente essenciais</button><Link to="/politica-de-privacidade" className="px-2 py-2 text-center text-sm text-primary hover:underline">Política de Privacidade</Link></div>
    </aside>
  );
}