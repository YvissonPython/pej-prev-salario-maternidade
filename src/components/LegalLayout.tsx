import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
const logo = "https://pejprevsalariomaternidade.lovable.app/assets/logo-pjprev-circular-0AoflDRs.jpg";

type Props = { title: string; subtitle: string; children: React.ReactNode };

export default function LegalLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src={logo} alt="P&J Prev" className="h-11 w-11 rounded-full object-cover" />
            <span className="font-serif font-semibold text-foreground">P&J Prev</span>
          </Link>
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-10">
          <ShieldCheck className="mb-4 h-9 w-9 text-primary" />
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
          <p className="mt-4 text-sm text-muted-foreground">Última atualização: 21 de agosto de 2026.</p>
        </div>
        <article className="legal-content space-y-8 text-base leading-relaxed text-muted-foreground">{children}</article>
      </main>
    </div>
  );
}