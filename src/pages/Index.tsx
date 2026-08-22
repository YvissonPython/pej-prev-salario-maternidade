import { useEffect, useRef, useState } from "react";
import {
  Check, FileText, Search, Heart, ChevronDown, ChevronRight,
  Mail, Phone, MapPin, Baby, Shield, Clock,
  MessageCircle, HelpCircle, Star, Users, Award,
  Instagram, ExternalLink, Building2
} from "lucide-react";
const logo = "https://pejprevsalariomaternidade.lovable.app/assets/logo-pjprev-circular-0AoflDRs.jpg";
const gestanteFeliz = "https://pejprevsalariomaternidade.lovable.app/assets/gestante-feliz-CSZJsqke.jpg";
const maeBebeFeliz = "https://pejprevsalariomaternidade.lovable.app/assets/mae-bebe-feliz-BX0n3RzG.jpg";
const rostoEmpresa = "https://pejprevsalariomaternidade.lovable.app/assets/pjprev-rosto-empresa-DLn8D0Gf.webp";
const equipeAtendimento = "https://pejprevsalariomaternidade.lovable.app/assets/equipe-atendimento-pjprev-BLtpDovc.webp";
const equipe = "https://pejprevsalariomaternidade.lovable.app/assets/equipe-pjprev-NPaiShRP.webp";
import StartFlowDialog from "@/components/StartFlowDialog";
import { trackEvent } from "@/lib/tracking";
import { loadPixels, fireConversion, listenForConsent } from "@/lib/pixels";
import { Link } from "react-router-dom";

/* ─── scroll-reveal hook ─── */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("section-visible"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    el.classList.add("section-hidden");
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const INSTAGRAM_URL = "https://www.instagram.com/pejprev_/";
const MAPS_URL = "https://maps.app.goo.gl/3YvycAQARNks93FT8";
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d506218.13460312574!2d-35.211338985709915!3d-7.593563372308102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab19328a02b2a5%3A0x733fa15492affb45!2sPeJ%20PREV%20Sal%C3%A1rio%20Maternidade!5e0!3m2!1spt-BR!2sbr!4v1786728933865!5m2!1spt-BR!2sbr";

/* ─── FAQ data ─── */
const faqs = [
  { q: "O que é o Salário Maternidade?", a: "É um benefício pago pelo INSS à segurada que acabou de ter um filho, adotou uma criança ou obteve guarda judicial para fins de adoção. Ele garante renda durante o período de afastamento." },
  { q: "Quem tem direito ao Salário Maternidade?", a: "Trabalhadoras com carteira assinada, contribuintes individuais, MEIs, empregadas domésticas, seguradas especiais (rurais) e até desempregadas que ainda estejam no período de graça do INSS." },
  { q: "Quanto tempo dura o benefício?", a: "Em geral, 120 dias (4 meses). Em casos de adoção, a duração pode variar conforme a idade da criança." },
  { q: "Posso receber mesmo estando desempregada?", a: "Sim! Se você foi demitida e ainda está dentro do período de graça (até 12 meses após a última contribuição, podendo chegar a 36 meses em alguns casos), você pode ter direito." },
  { q: "Qual o valor do benefício?", a: "Para quem tem carteira assinada, o valor é igual ao salário. Para contribuintes individuais e MEIs, é calculado com base na média das contribuições." },
  { q: "A P&J Prev cobra pela análise?", a: "A análise inicial é totalmente gratuita. Só há cobrança se seguirmos com o processo e você receber o benefício." },
];


const Index = () => {
  const heroRef = useScrollReveal();
  const whoRef = useScrollReveal();
  const howRef = useScrollReveal();
  const galleryRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const formRef = useScrollReveal();
  const socialRef = useScrollReveal();
  const teamRef = useScrollReveal();
  const instagramRef = useScrollReveal();
  const locationRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);
  const [flowSource, setFlowSource] = useState("hero");

  const openFlow = (source: string) => {
    setFlowSource(source);
    setFlowOpen(true);
    trackEvent("cta_comece_aqui", { source });
    fireConversion("CTAStart");
    setMobileMenu(false);
  };

  /* garante abertura no topo (hero) e não no meio da página */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  /* rastreamento e pixels */
  useEffect(() => {
    trackEvent("page_view");
    void loadPixels();
    return listenForConsent();
  }, []);




  /* Carrega o formulário externo após o conteúdo principal, sem bloquear a página. */
  useEffect(() => {
    if (document.querySelector("#respondi_src")) return;
    const loadEmbed = () => {
      if (document.querySelector("#respondi_src")) return;
      const script = document.createElement("script");
      script.async = true;
      script.id = "respondi_src";
      script.src = "https://embed.respondi.app/embed.js";
      document.body.appendChild(script);
    };
    const timer = window.setTimeout(loadEmbed, 450);
    return () => window.clearTimeout(timer);
  }, []);

  const navLinks = [
    { label: "Início", id: "inicio" },
    { label: "Quem tem direito", id: "quem-tem-direito" },
    { label: "Como funciona", id: "como-funciona" },
    { label: "Equipe", id: "equipe" },
    { label: "Instagram", id: "instagram" },
    { label: "Dúvidas", id: "duvidas" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════ NAVBAR ═══════ */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <button
            onClick={() => scrollTo("inicio")}
            aria-label="Ir para o início"
            className="flex items-center gap-3 rounded-xl p-1 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={logo}
              alt="P&J Prev"
              width={112}
              height={112}
              className="h-11 w-11 rounded-full object-cover shadow-card sm:h-14 sm:w-14"
            />
          </button>

          {/* desktop links */}
          <div className="hidden items-center gap-5 md:flex lg:gap-6">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className="rounded-md px-1 py-2 text-sm text-muted-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {l.label}
              </button>
            ))}
            <button onClick={() => openFlow("navbar")}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-gradient-hero px-5 text-sm font-semibold text-primary-foreground shadow-button transition-all hover:scale-[1.02] hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Comece por aqui
            </button>
          </div>

          {/* mobile toggle */}
          <button
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenu ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenu ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-foreground transition-all ${mobileMenu ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* mobile menu */}
        {mobileMenu && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-card px-4 pb-4 pt-2 sm:px-6 md:hidden animate-fade-in">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => { scrollTo(l.id); setMobileMenu(false); }}
                className="block min-h-[44px] w-full rounded-lg px-1 text-left text-base text-muted-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {l.label}
              </button>
            ))}
            <button onClick={() => openFlow("navbar_mobile")}
              className="mt-2 min-h-[48px] w-full rounded-xl bg-gradient-hero px-4 text-center text-base font-semibold text-primary-foreground shadow-button">
              Comece por aqui
            </button>
          </div>
        )}

      </nav>

      {/* ═══════ HERO ═══════ */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 pb-16 pt-12 md:py-20 lg:py-24" ref={heroRef}>
          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-14">
            <div className="animate-fade-in-up">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
                <Heart className="h-3 w-3" /> Cuidando de quem cuida
              </span>
              <h1 className="font-serif text-[1.75rem] font-bold leading-[1.15] text-balance text-foreground sm:text-4xl lg:text-5xl">
                Você pode ter direito ao{" "}
                <span className="text-primary">Salário Maternidade</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Mesmo desempregada, MEI ou contribuinte individual — descubra em poucos minutos se você pode receber esse benefício. Nossa equipe cuida de tudo por você.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button onClick={() => openFlow("hero")}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-hero px-8 py-4 text-base font-semibold text-primary-foreground shadow-button transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Comece por aqui
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button onClick={() => scrollTo("como-funciona")}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-6 py-3.5 text-base font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Como funciona
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Análise gratuita</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Resultado em minutos</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Todo o Brasil</span>
              </div>
            </div>

            {/* hero image */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative">
                <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent blur-2xl" />
                <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card-hover transition-all duration-500 ease-out hover:-translate-y-1">
                  <img
                    src={rostoEmpresa}
                    alt="Profissional da P&J Prev sorrindo durante atendimento"
                    width={768}
                    height={954}
                    decoding="async"
                    fetchPriority="high"
                    className="h-[390px] w-full object-cover object-[center_42%] transition-transform duration-500 ease-out group-hover:scale-[1.025] sm:h-[500px]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-card via-card/70 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-border bg-card/90 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-serif text-sm font-semibold text-foreground">Análise 100% gratuita</p>
                        <p className="text-xs text-muted-foreground">Resposta em poucos minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-3 -top-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg animate-float">
                  <Baby className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ QUEM TEM DIREITO ═══════ */}
      <section id="quem-tem-direito" className="py-16 sm:py-20 lg:py-24" ref={whoRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block text-sm font-medium text-primary">Quem pode receber?</span>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">
              Você pode ter direito se passou por isso
            </h2>
            <p className="mt-3 text-muted-foreground">Muitas mulheres não sabem que têm direito. Veja se você se identifica:</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: "Carteira assinada", desc: "Trabalhou de carteira assinada antes de engravidar ou durante a gestação" },
              { icon: Search, title: "Desempregada", desc: "Ficou desempregada durante a gestação e ainda contribuiu recentemente" },
              { icon: Heart, title: "Demitida grávida", desc: "Foi demitida enquanto estava grávida — mesmo sem saber da gravidez" },
              { icon: Users, title: "MEI ou autônoma", desc: "É microempreendedora individual ou contribuinte individual do INSS" },
              { icon: Baby, title: "Adoção", desc: "Adotou uma criança ou obteve guarda judicial para fins de adoção" },
              { icon: Award, title: "Segurada especial", desc: "Trabalhadora rural ou pescadora artesanal" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card focus-within:ring-2 focus-within:ring-ring transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/20">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COMO FUNCIONA ═══════ */}
      <section id="como-funciona" className="bg-secondary/50 py-16 sm:py-20 lg:py-24" ref={howRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block text-sm font-medium text-primary">Passo a passo</span>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">
              Simples, rápido e sem burocracia
            </h2>
            <p className="mt-3 text-muted-foreground">Você responde, a gente resolve. Tudo no seu tempo.</p>
          </div>

          <div className="relative mt-14 grid gap-8 sm:grid-cols-3">
            {/* connector */}
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-border sm:block" />
            {[
              { step: "1", title: "Faça o teste gratuito", desc: "Responda algumas perguntas simples sobre sua situação" },
              { step: "2", title: "Análise personalizada", desc: "Nossa equipe verifica se você tem direito ao benefício" },
              { step: "3", title: "Receba o benefício", desc: "Cuidamos de todo o processo até o dinheiro cair na sua conta" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-card font-serif text-lg font-semibold text-primary shadow-sm">
                  {step}
                </span>
                <h3 className="mt-5 font-serif text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GALERIA MATERNIDADE ═══════ */}
      <section className="py-16 sm:py-20 lg:py-24" ref={galleryRef}>
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="mb-3 inline-block text-sm font-medium text-primary">Maternidade</span>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">
              Cada momento merece ser vivido com tranquilidade
            </h2>
            <p className="mt-3 text-muted-foreground">Cuidamos da burocracia para você focar no que importa.</p>
          </div>

          <div className="grid items-stretch gap-6 sm:grid-cols-2">
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <div className="w-full overflow-hidden bg-muted">
                <img
                  src={gestanteFeliz}
                  alt="Gestante feliz segurando sapatinhos de bebê"
                  loading="lazy"
                  decoding="async"
                  width={768}
                  height={1024}
                  className="mx-auto block aspect-[4/5] h-auto w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex-1 bg-card p-5 sm:p-6">
                <h3 className="font-serif text-base font-semibold text-foreground">A espera mais doce</h3>
                <p className="mt-1 text-sm text-muted-foreground">Você merece segurança financeira desde a gestação.</p>
              </div>
            </div>
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <div className="w-full overflow-hidden bg-muted">
                <img
                  src={maeBebeFeliz}
                  alt="Mãe feliz segurando seu bebê recém-nascido"
                  loading="lazy"
                  decoding="async"
                  width={768}
                  height={1024}
                  className="mx-auto block aspect-[4/5] h-auto w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex-1 bg-card p-5 sm:p-6">
                <h3 className="font-serif text-base font-semibold text-foreground">O melhor presente</h3>
                <p className="mt-1 text-sm text-muted-foreground">Com o salário maternidade, cuide do seu bebê sem preocupações.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EQUIPE ═══════ */}
      <section id="equipe" className="bg-secondary/50 py-16 sm:py-20 lg:py-24" ref={teamRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="max-w-xl">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Building2 className="h-4 w-4" /> Atendimento de verdade
              </span>
              <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">Pessoas cuidando de pessoas</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Por trás de cada análise existe uma equipe preparada para ouvir, orientar e acompanhar cada mãe com clareza e respeito.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div><strong className="block font-serif text-2xl text-primary">Humano</strong><span className="text-sm text-muted-foreground">Atendimento próximo</span></div>
                <div><strong className="block font-serif text-2xl text-primary">Especializado</strong><span className="text-sm text-muted-foreground">Foco previdenciário</span></div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[0.85fr_1.15fr]">
              <img src={equipeAtendimento} alt="Equipe de atendimento da P&J Prev reunida" loading="lazy" width={466} height={410} className="h-72 w-full rounded-2xl border border-border object-cover object-center shadow-card sm:h-80" />
              <img src={equipe} alt="Equipe completa da P&J Prev no escritório" loading="lazy" width={681} height={500} className="h-72 w-full rounded-2xl border border-border object-cover object-center shadow-card sm:h-80" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ INSTAGRAM ═══════ */}
      <section id="instagram" className="py-16 sm:py-20 lg:py-24" ref={instagramRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary"><Instagram className="h-4 w-4" /> Acompanhe nosso dia a dia</span>
              <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">Informação e acolhimento no Instagram</h2>
              <p className="mt-3 text-lg text-muted-foreground">Conteúdo simples sobre seus direitos, bastidores e histórias da nossa equipe.</p>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_clicked", { source: "instagram_header" })} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <Instagram className="h-5 w-5" /> Seguir @pejprev_ <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { src: rostoEmpresa, alt: "Profissional P&J Prev em atendimento", label: "Orientação que acolhe", position: "object-[center_28%]" },
              { src: equipeAtendimento, alt: "Equipe P&J Prev durante atendimento", label: "Bastidores da equipe", position: "object-center" },
              { src: equipe, alt: "Time completo da P&J Prev", label: "Quem cuida dos seus direitos", position: "object-center" },
            ].map((item, index) => (
              <a key={item.label} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_clicked", { source: `instagram_card_${index + 1}` })} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-card focus-visible:ring-2 focus-visible:ring-ring">
                <img src={item.src} alt={item.alt} loading="lazy" width={640} height={640} className={`h-full w-full object-cover ${item.position} transition-transform duration-500 group-hover:scale-[1.025]`} />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-foreground/90 to-transparent p-5 pt-16 text-primary-foreground">
                  <span className="font-medium">{item.label}</span><Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="duvidas" className="bg-secondary/50 py-16 sm:py-20 lg:py-24" ref={faqRef}>
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block text-sm font-medium text-primary">Dúvidas frequentes</span>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">
              Perguntas que as mamães mais fazem
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 rounded-xl p-5 text-left transition-colors hover:bg-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-60 pb-5" : "max-h-0"}`}>
                  <p className="px-5 pl-[3.25rem] text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FORMULÁRIO ═══════ */}
      <section id="formulario" className="py-16 sm:py-20 lg:py-24" ref={formRef}>
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <span className="mb-3 inline-block text-sm font-medium text-primary">Atendimento</span>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">
              Como podemos te ajudar hoje?
            </h2>
            <p className="mt-3 text-muted-foreground">Escolha a opção que combina com você para agilizar seu atendimento.</p>
          </div>

          {/* Formulário Respondi incorporado */}
          <div
            id="formulario-respondi"
            className="relative mt-10 overflow-hidden rounded-3xl border border-primary/20 bg-card p-2 shadow-card-hover sm:p-4"
            onPointerDown={() => { trackEvent("form_interaction", { source: "secao_formulario" }); fireConversion("Lead"); }}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-20 rounded-full bg-primary/10 blur-3xl" />
            <div
              data-respondi-container=""
              data-respondi-mode="regular"
              data-respondi-src="https://form.respondi.app/aymmBnHN"
              data-respondi-width="100%"
              data-respondi-height="600px"
              className="relative min-h-[600px] w-full overflow-hidden rounded-2xl"
            />
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Ao continuar, você declara estar ciente da <Link to="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</Link> e dos <Link to="/termos-de-uso" className="text-primary hover:underline">Termos de Uso</Link>.
          </p>

          {/* CTA secundário — cliente existente */}
          <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Já é nossa cliente?</p>
                <p className="text-xs text-muted-foreground">Atendimento exclusivo para clientes em andamento.</p>
              </div>
            </div>
            <button
              onClick={() => openFlow("secao_formulario_cliente")}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </section>


      {/* ═══════ PROVA SOCIAL ═══════ */}
      <section className="bg-secondary/50 py-16 sm:py-20 lg:py-24" ref={socialRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block text-sm font-medium text-primary">Depoimentos</span>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">
              Quem já fez, recomenda
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { quote: "Recebi meu benefício e veio em uma boa hora. Gratidão por tudo!", name: "Natanea Maria", stars: 5 },
              { quote: "Recebi muito antes do esperado. Atendimento excelente e muito carinhoso!", name: "Paola Machado", stars: 5 },
              { quote: "Me ajudaram muito, valeu a pena. Recomendo para todas as mamães!", name: "Heloisa Santos", stars: 5 },
            ].map(({ quote, name, stars }) => (
              <div key={name} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">"{quote}"</p>
                <p className="mt-4 text-sm font-medium text-muted-foreground">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA FINAL ═══════ */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24" ref={ctaRef}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-primary-foreground sm:text-3xl">
            Não deixe esse dinheiro parado
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Quanto antes você solicitar, mais rápido pode receber. A análise é gratuita e sem compromisso.
          </p>
          <button onClick={() => openFlow("cta_final")}
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-card px-8 py-4 text-base font-semibold text-primary shadow-card-hover transition-all duration-200 hover:scale-[1.03]">
            Comece por aqui
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ═══════ LOCALIZAÇÃO ═══════ */}
      <section id="localizacao" className="py-16 sm:py-20 lg:py-24" ref={locationRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid-cols-[0.68fr_1.32fr]">
            <div className="flex min-w-0 flex-col justify-center p-7 sm:p-10">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary"><MapPin className="h-4 w-4" /> Onde estamos</span>
              <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-foreground sm:text-3xl">P&J Prev em Recife</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Encontre nossa equipe e trace sua rota pelo Google Maps.</p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("maps_clicked", { source: "location_section" })} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-base font-medium text-foreground transition-colors hover:bg-secondary sm:w-fit">
                Abrir no Google Maps <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="aspect-[4/3] min-h-80 min-w-0 bg-muted lg:aspect-auto lg:min-h-[430px]">
              <iframe src={MAP_EMBED_URL} title="Localização da P&J Prev no Google Maps" width="600" height="450" className="h-full w-full border-0" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ RODAPÉ ═══════ */}
      <footer className="border-t border-border pb-28 pt-12 sm:pb-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="P&J Prev" width={112} height={112} loading="lazy" className="h-12 w-12 rounded-full object-cover shadow-card" />
                <span className="font-serif text-base font-semibold leading-tight text-foreground">P&J Prev</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Cuidando dos seus direitos com carinho e dedicação. Atendimento em todo o Brasil.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Localização</h3>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("maps_clicked", { source: "footer" })} className="mt-3 flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Recife - PE
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Contato</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" /> (81) 3019-2443
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" /> pejprevrecife@gmail.com
              </p>
              <a href="https://wa.me/558130192443" target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline">
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">CNPJ</h3>
              <p className="mt-3 text-sm text-muted-foreground">38.381.395/0001-92</p>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <Link to="/politica-de-privacidade" className="hover:text-primary hover:underline">Política de Privacidade</Link>
              <Link to="/termos-de-uso" className="hover:text-primary hover:underline">Termos de Uso</Link>
              <button onClick={() => window.dispatchEvent(new Event("pj:cookie-preferences"))} className="hover:text-primary hover:underline">Preferências de cookies</button>
            </div>
            © {new Date().getFullYear()} P&J Prev. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* ═══════ CTA FIXO MOBILE ═══════ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur-sm sm:hidden">
        <button onClick={() => openFlow("cta_fixo_mobile")}
          className="min-h-[52px] w-full rounded-xl bg-gradient-hero py-4 text-base font-semibold text-primary-foreground shadow-button transition-all hover:shadow-card-hover">
          Comece por aqui
        </button>
      </div>

      <StartFlowDialog open={flowOpen} onOpenChange={setFlowOpen} source={flowSource} />
    </div>
  );
};

export default Index;
