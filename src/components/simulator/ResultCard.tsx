import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ArrowLeft,
  Mail,
  MessageCircle,
  Sparkles,
  Copy,
  Check,
  Send,
  Shield,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-result.jpg";
import logo from "@/assets/logo-pjprev.jpg";

interface ResultCardProps {
  answers: Record<string, string>;
  onRestart: () => void;
}

/* ─── label maps ─── */
const profileLabels: Record<string, string> = {
  gestante_primeiro: "Gestante do 1º filho",
  gestante_outro: "Gestante (não é o 1º filho)",
  mae_nao_gestante: "Mãe (não gestante)",
  mae_adotiva: "Mãe adotiva",
  mae_natimorto: "Mãe de natimorto",
};

const workLabels: Record<string, string> = {
  clt: "CLT (Carteira assinada)",
  autonoma: "Autônoma / Contribuinte Individual",
  mei: "MEI",
  desempregada: "Desempregada",
  domestica: "Empregada Doméstica",
};

const contribLabels: Record<string, string> = {
  sim_regular: "Sim, regularmente",
  sim_irregular: "Sim, com falhas",
  nao: "Não contribuiu",
  nao_sei: "Não tem certeza",
};

const tempoLabels: Record<string, string> = {
  menos_10: "Menos de 10 meses",
  "10_a_24": "De 10 meses a 2 anos",
  "2_a_5": "De 2 a 5 anos",
  mais_5: "Mais de 5 anos",
};

const gestacaoLabels: Record<string, string> = {
  inicio: "1º trimestre",
  meio: "2º trimestre",
  final: "3º trimestre",
  ja_nasceu: "Bebê já nasceu",
  adocao: "Adoção em andamento",
};

const rendaLabels: Record<string, string> = {
  ate_1_salario: "Até 1 salário mínimo",
  "1_a_3": "De 1 a 3 salários mínimos",
  "3_a_5": "De 3 a 5 salários mínimos",
  acima_5: "Acima de 5 salários mínimos",
};

const contatoLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  tela: "Na tela",
};

/* ─── helpers ─── */
const l = (map: Record<string, string>, key?: string) =>
  key ? map[key] ?? "N/A" : "N/A";

const isProfile = (a: Record<string, string>, id: string) =>
  a.perfil === id ? "Sim" : "N/A";

/* ─── confetti burst ─── */
const fireConfetti = () => {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
  const fire = (opts: confetti.Options) =>
    confetti({ ...defaults, ...opts });

  fire({ particleCount: 50, origin: { x: 0.3, y: 0.6 } });
  fire({ particleCount: 50, origin: { x: 0.7, y: 0.6 } });
  setTimeout(() => {
    fire({ particleCount: 30, origin: { x: 0.5, y: 0.4 }, colors: ["#a855f7", "#d4a853", "#ec4899"] });
  }, 300);
};

const ResultCard = ({ answers, onRestart }: ResultCardProps) => {
  const [loadingChannel, setLoadingChannel] = useState<"whatsapp" | "email" | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  /* confetti on mount */
  useEffect(() => {
    const t = setTimeout(fireConfetti, 600);
    return () => clearTimeout(t);
  }, []);

  /* build message body */
  const messageBody = useMemo(() => {
    const gestacaoVal =
      answers.perfil === "mae_adotiva" || answers.perfil === "mae_natimorto"
        ? "N/A"
        : l(gestacaoLabels, answers.situacao_gestacao);

    return `Olá! Finalizei o Simulador de Salário Maternidade da P&J Prev. Aqui estão meus dados:

- Perfil: ${l(profileLabels, answers.perfil)}
- Situação Profissional: ${l(workLabels, answers.trabalho)}
- Contribuição INSS (últimos 12 meses): ${l(contribLabels, answers.contribuicao)}
- Tempo total de contribuição: ${l(tempoLabels, answers.tempo_contribuicao)}
- Estágio da gestação/situação: ${gestacaoVal}
- Faixa de renda: ${l(rendaLabels, answers.renda)}
- Canal de preferência: ${l(contatoLabels, answers.contato)}
- Mãe Adotiva: ${isProfile(answers, "mae_adotiva")}
- Mãe de Natimorto: ${isProfile(answers, "mae_natimorto")}

Gostaria de receber meu resultado por aqui!`;
  }, [answers]);

  const handleWhatsApp = useCallback(() => {
    setLoadingChannel("whatsapp");
    setTimeout(() => {
      const url = `https://wa.me/558130192443?text=${encodeURIComponent(messageBody)}`;
      window.open(url, "_blank");
      setLoadingChannel(null);
      toast({
        title: "✅ Tudo certo!",
        description: "Agora é só clicar ENVIAR no WhatsApp.",
      });
    }, 1400);
  }, [messageBody, toast]);

  const handleEmail = useCallback(() => {
    setLoadingChannel("email");
    setTimeout(() => {
      const subject = encodeURIComponent("Resultado Salário Maternidade - P&J Prev");
      const body = encodeURIComponent(messageBody);
      window.open(
        `mailto:pejprevrecife@gmail.com?subject=${subject}&body=${body}`,
        "_self"
      );
      setLoadingChannel(null);
      toast({
        title: "✅ E-mail preparado!",
        description: "Revise e clique Enviar no seu app de e-mail.",
      });
    }, 1400);
  }, [messageBody, toast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    toast({ title: "📋 Copiado!", description: "Cole a mensagem no canal desejado." });
    setTimeout(() => setCopied(false), 2500);
  }, [messageBody, toast]);

  /* ─── animations ─── */
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {/* ARIA-live region for screen readers */}
      <div className="sr-only" aria-live="polite" role="status">
        {loadingChannel === "whatsapp" && "Montando sua mensagem para WhatsApp..."}
        {loadingChannel === "email" && "Preparando seu e-mail..."}
        {!loadingChannel && "Simulação concluída. Escolha como receber seu resultado."}
      </div>

      {/* ───── HERO ───── */}
      <motion.div variants={fadeUp} className="relative w-full rounded-2xl overflow-hidden mb-8">
        <img
          src={heroImg}
          alt="Mulher gestante em ambiente iluminado e acolhedor"
          className="w-full h-56 sm:h-72 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
        {/* floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: 6 + i * 4,
                height: 6 + i * 4,
                left: `${15 + i * 14}%`,
                bottom: `${20 + (i % 3) * 20}%`,
              }}
              animate={{ y: [0, -18, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-primary-foreground leading-tight drop-shadow-lg">
            Simulação Concluída!
          </h2>
          <p className="font-body text-primary-foreground/90 text-base sm:text-lg mt-1 drop-shadow">
            Veja seu próximo passo.
          </p>
        </div>
      </motion.div>

      {/* ───── PARABÉNS ───── */}
      <motion.div variants={fadeUp} className="bg-card rounded-2xl shadow-card p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
          </motion.div>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
              Parabéns, tudo pronto!
            </h3>
            <p className="font-body text-muted-foreground text-sm sm:text-base">
              Você está a um clique de garantir seus direitos.
            </p>
          </div>
        </div>
        <p className="font-body text-muted-foreground text-sm leading-relaxed">
          Em instantes, envie suas informações para nossa equipe: atendimento
          rápido via <strong className="text-foreground">WhatsApp</strong> ou{" "}
          <strong className="text-foreground">E-mail</strong>, no canal que{" "}
          <strong className="text-foreground">VOCÊ</strong> escolher.
        </p>
      </motion.div>

      {/* ───── RESUMO ───── */}
      <motion.div variants={fadeUp} className="bg-lilac-soft rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="font-display font-semibold text-lg text-foreground">
            Resumo da sua simulação
          </h3>
        </div>
        <div className="space-y-2">
          {[
            ["Perfil", l(profileLabels, answers.perfil)],
            ["Situação profissional", l(workLabels, answers.trabalho)],
            ["Contribuição INSS", l(contribLabels, answers.contribuicao)],
            ["Tempo de contribuição", l(tempoLabels, answers.tempo_contribuicao)],
            ["Estágio gestação", l(gestacaoLabels, answers.situacao_gestacao)],
            ["Faixa de renda", l(rendaLabels, answers.renda)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center py-2 border-b border-border last:border-0"
            >
              <span className="text-muted-foreground font-body text-sm">{label}</span>
              <span className="font-body font-semibold text-foreground text-sm text-right max-w-[55%]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ───── INSTRUÇÃO ───── */}
      <motion.div variants={fadeUp} className="bg-gold-light rounded-2xl p-5 mb-6 border border-border">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-body text-foreground text-sm leading-relaxed">
            <strong>Clique em uma opção abaixo.</strong> Suas respostas já estão
            preparadas — ao abrir WhatsApp ou E-mail, basta revisar e clicar em{" "}
            <strong>ENVIAR</strong>!
          </p>
        </div>
      </motion.div>

      {/* ───── ACTION BUTTONS ───── */}
      <motion.div variants={fadeUp} className="space-y-4 mb-6">
        {/* WhatsApp */}
        <motion.button
          onClick={handleWhatsApp}
          disabled={loadingChannel !== null}
          whileHover={{ scale: 1.02, boxShadow: "0 0 28px 4px hsl(142 70% 45% / 0.25)" }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-display font-bold text-lg text-primary-foreground overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, hsl(142 70% 45%), hsl(263 84% 58%))" }}
          aria-label="Receber resultado pelo WhatsApp"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent animate-shimmer pointer-events-none" />
          <AnimatePresence mode="wait">
            {loadingChannel === "whatsapp" ? (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Send className="w-5 h-5 animate-pulse" aria-hidden="true" />
                Montando sua mensagem...
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                </motion.span>
                Receber Resultado pelo WhatsApp
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* E-mail */}
        <motion.button
          onClick={handleEmail}
          disabled={loadingChannel !== null}
          whileHover={{ scale: 1.02, boxShadow: "0 0 28px 4px hsl(40 50% 55% / 0.25)" }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-display font-bold text-lg text-primary-foreground overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, hsl(220 80% 56%), hsl(263 84% 58%))" }}
          aria-label="Receber resultado por E-mail"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent animate-shimmer pointer-events-none" />
          <AnimatePresence mode="wait">
            {loadingChannel === "email" ? (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Send className="w-5 h-5 animate-pulse" aria-hidden="true" />
                Preparando e-mail...
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                  <Mail className="w-6 h-6" aria-hidden="true" />
                </motion.span>
                Receber Resultado por E-mail
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ───── COPY FALLBACK ───── */}
      <motion.div variants={fadeUp} className="bg-card rounded-2xl shadow-card p-5 mb-6">
        <p className="font-body text-muted-foreground text-xs mb-3 leading-relaxed">
          Se sua mensagem não aparecer pronta, copie o texto abaixo e cole manualmente:
        </p>
        <pre className="bg-muted rounded-xl p-4 text-xs text-foreground whitespace-pre-wrap font-body leading-relaxed max-h-40 overflow-y-auto">
          {messageBody}
        </pre>
        <button
          onClick={handleCopy}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border text-sm font-display font-medium text-foreground hover:bg-muted transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Copiar mensagem"
        >
          {copied ? (
            <><Check className="w-4 h-4 text-primary" aria-hidden="true" /> Copiado!</>
          ) : (
            <><Copy className="w-4 h-4" aria-hidden="true" /> Copiar mensagem</>
          )}
        </button>
      </motion.div>

      {/* ───── RESTART ───── */}
      <motion.div variants={fadeUp} className="flex justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-border text-foreground font-display font-medium hover:bg-muted transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Refazer Simulação
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;
