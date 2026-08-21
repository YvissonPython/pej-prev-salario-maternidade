import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, MessageCircle, Sparkles, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/tracking";
import { fireConversion } from "@/lib/pixels";

const FORM_URL = "https://form.respondi.app/Dg1sDMTh";
const WHATSAPP_NUMBER = "5581994271461";

type Step = "choice" | "cliente";

interface StartFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

const StartFlowDialog = ({ open, onOpenChange, source = "desconhecido" }: StartFlowDialogProps) => {
  const [step, setStep] = useState<Step>("choice");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep("choice");
      setErro(null);
      trackEvent("flow_opened", { source });
    }
  }, [open, source]);

  const handleNovaCliente = () => {
    trackEvent("select_nova_cliente", { source });
    trackEvent("form_opened", { source });
    fireConversion("Lead");
    window.open(FORM_URL, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleJaCliente = () => {
    trackEvent("select_ja_cliente", { source });
    setStep("cliente");
  };

  const handleWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    const nomeLimpo = nome.trim();
    if (nomeLimpo.length < 3 || nomeLimpo.length > 80) {
      setErro("Por favor, informe seu nome completo (mínimo 3 caracteres).");
      return;
    }
    setErro(null);
    trackEvent("whatsapp_clicked", { source, tipo: "cliente_existente" });
    fireConversion("Contact");
    const mensagem = `Olá! Meu nome é ${nomeLimpo}. Vim através do site e já sou cliente da P&J Prev.`;
    const link = document.createElement("a");
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 rounded-2xl p-0 overflow-hidden">
        <div className="bg-gradient-hero px-6 py-6 text-primary-foreground">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="font-serif text-xl font-semibold text-primary-foreground sm:text-2xl">
              Como podemos ajudar você?
            </DialogTitle>
            <DialogDescription className="text-sm text-primary-foreground/80">
              Escolha a opção abaixo para direcionarmos seu atendimento.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 sm:p-6">
          {step === "choice" ? (
            <div className="grid gap-3 animate-fade-in">
              <button
                onClick={handleNovaCliente}
                className="group relative flex items-start gap-4 rounded-xl border-2 border-primary bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Recomendado
                  </span>
                  <span className="mt-1 block text-base font-semibold text-foreground">
                    Ainda não sou cliente
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Faça sua análise gratuita e descubra se você tem direito ao Salário Maternidade.
                  </span>
                </span>
                <ChevronRight className="mt-3 h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleJaCliente}
                className="group flex items-start gap-4 rounded-xl border border-border bg-secondary/50 p-5 text-left transition-all hover:border-primary/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-base font-semibold text-foreground">Já sou cliente</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Atendimento prioritário no WhatsApp para processos em andamento.
                  </span>
                </span>
                <ChevronRight className="mt-3 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleWhatsapp} className="animate-fade-in">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>

              <label htmlFor="nome-cliente" className="block text-sm font-medium text-foreground">
                Qual é o seu nome completo?
              </label>
              <input
                id="nome-cliente"
                type="text"
                autoFocus
                value={nome}
                maxLength={80}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Souza da Silva"
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {erro && <p className="mt-2 text-sm text-destructive">{erro}</p>}

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-button transition-all hover:scale-[1.01] hover:shadow-card-hover"
              >
                <MessageCircle className="h-5 w-5" />
                Continuar no WhatsApp
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Você será direcionada ao atendimento exclusivo para clientes.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartFlowDialog;
