import { useEffect } from "react";
import { CheckCircle2, Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { fireConversion } from "@/lib/pixels";
import { trackEvent } from "@/lib/tracking";

const WHATSAPP_URL = "https://wa.me/5581994271461?text=Ol%C3%A1%21%20Conclu%C3%AD%20a%20an%C3%A1lise%20pelo%20site%20da%20P%26J%20Prev%20e%20gostaria%20de%20confirmar%20os%20pr%C3%B3ximos%20passos.";

export default function ThankYou() {
  useEffect(() => {
    void trackEvent("lead_completed", { source: "respondi" });
    fireConversion("Lead");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-soft px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-card-hover">
        <div className="bg-gradient-hero px-6 py-10 text-center text-primary-foreground sm:px-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/12">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-serif text-2xl font-semibold sm:text-3xl">Informações recebidas</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/82 sm:text-base">
            Obrigada por concluir sua análise inicial. Nossa equipe avaliará as informações enviadas e orientará você sobre os próximos passos.
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-10">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/45 p-4">
              <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-foreground">Aguarde nosso contato</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Mantenha seu telefone disponível para receber a orientação da equipe.</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/45 p-4">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-foreground">Análise individual</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Cada situação é avaliada conforme as informações e documentos apresentados.</p>
            </div>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackEvent("whatsapp_clicked", { source: "pagina_obrigado" })}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-button transition-colors hover:bg-primary/92"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Confirmar pelo WhatsApp
          </a>

          <Link to="/" className="block text-center text-sm font-medium text-primary hover:underline">
            Voltar ao site
          </Link>
        </div>
      </section>
    </main>
  );
}
