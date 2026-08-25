import { useEffect, useRef, useState } from "react";
import {
  FileText, Search, Heart, ChevronDown, ChevronRight,
  Mail, Phone, MapPin, Baby, Shield, Clock,
  MessageCircle, HelpCircle, Star, Users, Award,
  Instagram, ExternalLink, Building2
} from "lucide-react";
const logo = "https://pejprevsalariomaternidade.lovable.app/assets/logo-pjprev-circular-0AoflDRs.jpg";
const heroEspecialista = "/images/especialista-institucional-v2.webp";
const gestanteSemCarteira = "/images/gestante-editorial-v2.webp";
const duvidasBeneficio = "/images/mae-bebe-editorial-v2.webp";
const equipeAtendimento = "/images/equipe-atendimento.webp";
const equipeAcolhimento = "/images/equipe-acolhimento.webp";
const atendimentoDigital = "/images/atendimento-digital-v2.webp";
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("section-visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("section-visible"); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    el.classList.add("section-hidden");
    const frame = window.requestAnimationFrame(() => obs.observe(el));
    return () => {
      window.cancelAnimationFrame(frame);
      obs.disconnect();
    };
  }, []);
  return ref;
};

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const INSTAGRAM_URL = "https://www.instagram.com/pejprev_/";
const MAPS_URL = "https://maps.app.goo.gl/3YvycAQARNks93FT8";
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d506218.13460312574!2d-35.211338985709915!3d-7.593563372308102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab19328a02b2a5%3A0x733fa15492affb45!2sPeJ%20PREV%20Sal%C3%A1rio%20Maternidade!5e0!3m2!1spt-BR!2sbr!4v1786728933865!5m2!1spt-BR!2sbr";

const experienceScenes = [
  { id: "inicio", key: "entrada", label: "Entrada" },
  { id: "quem-tem-direito", key: "clareza", label: "Clareza" },
  { id: "como-funciona", key: "agilidade", label: "Agilidade" },
  { id: "acolhimento", key: "acolhimento", label: "Acolhimento" },
  { id: "equipe", key: "autoridade", label: "Autoridade" },
  { id: "duvidas", key: "seguranca", label: "Segurança" },
  { id: "formulario", key: "compromisso", label: "Compromisso" },
];

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
  const [activeScene, setActiveScene] = useState("entrada");

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

  /* Motor leve da visita 360º: apenas CSS variables, sem WebGL pesado. */
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-experience-scene]"));
    if (!scenes.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const key = (visible?.target as HTMLElement | undefined)?.dataset.experienceScene;
      if (key) setActiveScene(key);
    }, { threshold: [0.25, 0.45, 0.65], rootMargin: "-12% 0px -28% 0px" });

    scenes.forEach(scene => observer.observe(scene));
    if (reducedMotion) return () => observer.disconnect();

    let frame = 0;
    const updateJourney = () => {
      const viewport = window.innerHeight;
      const scrollRange = Math.max(document.documentElement.scrollHeight - viewport, 1);
      document.documentElement.style.setProperty("--journey-progress", String(window.scrollY / scrollRange));
      scenes.forEach(scene => {
        const rect = scene.getBoundingClientRect();
        const raw = (rect.top + rect.height / 2 - viewport / 2) / Math.max(viewport + rect.height, 1);
        scene.style.setProperty("--scene-progress", String(Math.max(-1, Math.min(1, raw))));
      });
      frame = 0;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateJourney);
    };
    updateJourney();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
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
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollTo("inicio")}
            aria-label="Ir para o início"
            className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={logo}
              alt="P&J Prev"
              width={112}
              height={112}
              className="h-11 w-11 rounded-full object-cover ring-1 ring-border sm:h-12 sm:w-12"
            />
            <span className="text-left">
              <strong className="block font-serif text-base font-semibold leading-none text-foreground">P&amp;J Prev</strong>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Atendimento previdenciário</span>
            </span>
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
              className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-button transition-colors hover:bg-primary/92 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Iniciar análise
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

      <aside className="experience-rail" aria-label="Jornada pela P&J Prev">
        <span className="experience-rail-progress" aria-hidden="true" />
        {experienceScenes.map(scene => (
          <button key={scene.key} type="button" onClick={() => scrollTo(scene.id)} aria-label={`Ir para ${scene.label}`} aria-current={activeScene === scene.key ? "step" : undefined} className={`experience-rail-step ${activeScene === scene.key ? "is-active" : ""}`}>
            <span className="experience-rail-dot" aria-hidden="true" />
            <span className="experience-rail-label">{scene.label}</span>
          </button>
        ))}
      </aside>

      {/* ═══════ HERO ═══════ */}
      <section id="inicio" data-experience-scene="entrada" data-scene-direction="right" className="experience-scene relative overflow-visible bg-[#0d2538] text-white" ref={heroRef}>
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <img src={heroEspecialista} alt="" width={1122} height={1402} decoding="async" fetchPriority="high" className="hero-cover-image h-full w-full object-cover object-[66%_center] md:absolute md:inset-y-0 md:right-0 md:w-[58%] md:object-[68%_center]" />
          <div className="hero-cover-overlay absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d2538] to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-7xl items-center px-4 pb-36 pt-16 sm:px-6 sm:pb-40 lg:px-8 lg:py-24 lg:pb-44">
          <div className="animate-fade-in-up max-w-2xl md:w-[54%] lg:w-[52%]">
            <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              <span className="h-px w-9 bg-white/50" /> Orientação especializada
            </span>
            <h1 className="font-serif text-[2.45rem] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-[4rem]">
              Seu direito merece ser <span className="text-[#9fc7e2]">compreendido com clareza.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Análise inicial gratuita para gestantes, mães, MEIs, autônomas e seguradas do INSS, com atendimento humano em todo o Brasil.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button onClick={() => openFlow("hero")}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary shadow-card-hover transition-colors hover:bg-[#eaf3f8] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                Fazer análise gratuita <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => scrollTo("como-funciona")}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Como funciona <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-5 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#9fc7e2]" /> Análise gratuita</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#9fc7e2]" /> Orientação objetiva</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#9fc7e2]" /> Todo o Brasil</span>
            </div>
          </div>
        </div>

        <div className="hero-quick-panel relative z-20 mx-auto -mt-28 w-[calc(100%-2rem)] max-w-6xl translate-y-16 overflow-hidden rounded-2xl border border-white/70 bg-card text-foreground shadow-[0_28px_70px_-34px_rgba(5,25,42,0.55)] sm:w-[calc(100%-3rem)] lg:grid lg:grid-cols-[0.72fr_1.55fr_auto] lg:items-stretch">
          <div className="flex flex-col justify-center bg-secondary/65 p-6 sm:p-7">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Comece por aqui</span>
            <p className="mt-2 font-serif text-xl font-semibold leading-snug">Entenda seu caso em poucos passos</p>
          </div>
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: FileText, step: "01", label: "Conte sua situação" },
              { icon: Search, step: "02", label: "Receba uma análise" },
              { icon: Shield, step: "03", label: "Veja os próximos passos" },
            ].map(({ icon: Icon, step, label }) => (
              <div key={step} className="flex items-center gap-3 p-5 sm:flex-col sm:items-start sm:justify-center sm:p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                <div><span className="text-[10px] font-bold tracking-[0.16em] text-primary/60">ETAPA {step}</span><p className="mt-0.5 text-sm font-semibold text-foreground">{label}</p></div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-5 sm:p-6">
            <button onClick={() => openFlow("hero_quick_panel")} className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-button hover:bg-primary/92 lg:w-auto">
              Iniciar agora <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ QUEM TEM DIREITO ═══════ */}
      <section id="quem-tem-direito" data-experience-scene="clareza" data-scene-direction="left" className="experience-scene pb-20 pt-36 sm:pb-24 sm:pt-40 lg:pb-28 lg:pt-44" ref={whoRef}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 border-b border-border pb-9 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary"><span className="h-px w-8 bg-primary/50" /> Quem pode receber?</span>
            <div>
            <h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">
              Você pode ter direito se passou por isso
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Muitas mulheres não sabem que têm direito. Veja se alguma destas situações se aproxima da sua realidade.</p>
            </div>
          </div>

          <div className="reveal-stagger mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: "Carteira assinada", desc: "Trabalhou de carteira assinada antes de engravidar ou durante a gestação" },
              { icon: Search, title: "Desempregada", desc: "Ficou desempregada durante a gestação e ainda contribuiu recentemente" },
              { icon: Heart, title: "Demitida grávida", desc: "Foi demitida enquanto estava grávida — mesmo sem saber da gravidez" },
              { icon: Users, title: "MEI ou autônoma", desc: "É microempreendedora individual ou contribuinte individual do INSS" },
              { icon: Baby, title: "Adoção", desc: "Adotou uma criança ou obteve guarda judicial para fins de adoção" },
              { icon: Award, title: "Segurada especial", desc: "Trabalhadora rural ou pescadora artesanal" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="reveal-item group bg-card p-7 transition-colors duration-300 hover:bg-secondary/65 sm:p-8">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
      <section id="como-funciona" data-experience-scene="agilidade" data-scene-direction="right" className="experience-scene bg-[#0d2538] py-20 text-primary-foreground sm:py-24 lg:py-28" ref={howRef}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="max-w-xl lg:sticky lg:top-28 lg:self-start">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60"><span className="h-px w-8 bg-white/30" /> Passo a passo</span>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance text-primary-foreground sm:text-4xl">
              Um processo claro, conduzido com atenção
            </h2>
            <p className="mt-5 leading-7 text-primary-foreground/65">Você fornece as informações iniciais e nossa equipe orienta os próximos passos com transparência.</p>
            <button onClick={() => openFlow("como_funciona")} className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10">Iniciar análise <ChevronRight className="h-4 w-4" /></button>
          </div>

          <div className="reveal-stagger grid gap-4">
            {[
              { step: "1", title: "Faça o teste gratuito", desc: "Responda algumas perguntas simples sobre sua situação" },
              { step: "2", title: "Análise personalizada", desc: "Nossa equipe verifica se você tem direito ao benefício" },
              { step: "3", title: "Acompanhamento do pedido", desc: "Você recebe orientação e acompanhamento durante as etapas aplicáveis ao seu caso" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="reveal-item group grid gap-5 rounded-xl border border-white/10 bg-white/[0.045] px-6 py-7 backdrop-blur-sm transition-colors hover:bg-white/[0.07] sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 font-serif text-lg font-semibold text-primary-foreground">
                  {step}
                </span>
                <div><h3 className="font-serif text-xl font-semibold text-primary-foreground">{title}</h3><p className="mt-2 text-sm leading-6 text-primary-foreground/60">{desc}</p></div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ═══════ GALERIA MATERNIDADE ═══════ */}
      <section id="acolhimento" data-experience-scene="acolhimento" data-scene-direction="left" className="experience-scene py-16 sm:py-20 lg:py-24" ref={galleryRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-12 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary"><span className="h-px w-8 bg-primary/50" /> Maternidade</span>
            <div><h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">
              Cada momento merece ser vivido com tranquilidade
            </h2>
            <p className="mt-3 text-muted-foreground">Orientação para que você entenda a burocracia e possa focar no que importa.</p></div>
          </div>

          <div className="reveal-stagger grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
            <div className="reveal-item media-frame group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:mt-16">
              <div className="w-full overflow-hidden bg-muted">
                <img
                  src={gestanteSemCarteira}
                  alt="Gestante conhecendo seus direitos ao salário-maternidade"
                  loading="lazy"
                  decoding="async"
                  width={1122}
                  height={1402}
                  className="mx-auto block aspect-[4/5] h-auto w-full object-cover object-[54%_center] transition-transform duration-700 ease-out group-hover:scale-[1.025] sm:object-center"
                />
              </div>
              <div className="flex-1 bg-card p-5 sm:p-6">
                <h3 className="font-serif text-base font-semibold text-foreground">Mesmo sem carteira assinada</h3>
                <p className="mt-1 text-sm text-muted-foreground">Seu histórico de contribuições pode preservar o direito ao benefício.</p>
              </div>
            </div>
            <div className="reveal-item media-frame group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <div className="w-full overflow-hidden bg-muted">
                <img
                  src={duvidasBeneficio}
                  alt="Mãe com bebê esclarecendo dúvidas sobre o benefício"
                  loading="lazy"
                  decoding="async"
                  width={1122}
                  height={1402}
                  className="mx-auto block aspect-[4/5] h-auto w-full object-cover object-[52%_center] transition-transform duration-700 ease-out group-hover:scale-[1.025] sm:object-center"
                />
              </div>
              <div className="flex-1 bg-card p-5 sm:p-6">
                <h3 className="font-serif text-base font-semibold text-foreground">Ainda pode existir um caminho</h3>
                <p className="mt-1 text-sm text-muted-foreground">Cada caso tem prazos e condições próprias. A análise inicial ajuda a entender isso.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EQUIPE ═══════ */}
      <section id="equipe" data-experience-scene="autoridade" data-scene-direction="right" className="experience-scene border-y border-border/70 bg-[#f3f6f8] py-20 sm:py-24 lg:py-28" ref={teamRef}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <Building2 className="h-4 w-4" /> Atendimento de verdade
              </span>
              <h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">Pessoas cuidando de pessoas</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Por trás de cada análise existe uma equipe preparada para ouvir, orientar e acompanhar cada mãe com clareza e respeito.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                <div className="bg-card p-5"><strong className="block font-serif text-xl text-primary">Humano</strong><span className="mt-1 block text-xs text-muted-foreground">Atendimento próximo</span></div>
                <div className="bg-card p-5"><strong className="block font-serif text-xl text-primary">Especializado</strong><span className="mt-1 block text-xs text-muted-foreground">Foco previdenciário</span></div>
              </div>
            </div>
            <div className="reveal-stagger grid gap-4 sm:grid-cols-[0.85fr_1.15fr]">
              <div className="reveal-item media-frame group overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <img src={equipeAtendimento} alt="Equipe de atendimento da P&J Prev reunida" loading="lazy" decoding="async" width={456} height={407} className="h-72 w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] sm:h-80" />
              </div>
              <div className="reveal-item media-frame group overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <img src={equipeAcolhimento} alt="Profissionais da P&J Prev em momento de acolhimento" loading="lazy" decoding="async" width={418} height={454} className="h-72 w-full object-cover object-[center_42%] transition-transform duration-700 ease-out group-hover:scale-[1.025] sm:h-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ INSTAGRAM ═══════ */}
      <section id="instagram" className="py-16 sm:py-20 lg:py-24" ref={instagramRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 border-b border-border pb-9 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Instagram className="h-4 w-4" /> Acompanhe nosso dia a dia</span>
              <h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">Informação e acolhimento no Instagram</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">Conteúdo simples sobre seus direitos, bastidores e histórias da nossa equipe.</p>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_clicked", { source: "instagram_header" })} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <Instagram className="h-5 w-5" /> Seguir @pejprev_ <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 grid overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid-cols-[1.05fr_0.95fr]">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_clicked", { source: "instagram_editorial" })} className="media-frame group relative min-h-[420px] overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[540px]">
              <img src={atendimentoDigital} alt="Especialista da P&J Prev em atendimento digital" loading="lazy" decoding="async" width={1122} height={1402} className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
              <span className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-foreground/55 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Instagram className="h-4 w-4" /> Bastidores do atendimento
              </span>
            </a>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Conteúdo responsável</span>
              <h3 className="mt-4 font-serif text-2xl font-semibold leading-snug text-foreground sm:text-3xl">Informação clara também aproxima</h3>
              <p className="mt-4 leading-7 text-muted-foreground">Acompanhe orientações, dúvidas frequentes e os bastidores de uma equipe que trata cada história com atenção.</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("instagram_clicked", { source: "instagram_editorial_cta" })} className="mt-7 inline-flex min-h-[48px] w-fit items-center justify-center gap-2 rounded-lg border border-primary/20 bg-secondary px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary hover:text-primary-foreground">
                Conhecer o perfil <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="duvidas" data-experience-scene="seguranca" data-scene-direction="left" className="experience-scene bg-secondary/50 py-20 sm:py-24 lg:py-28" ref={faqRef}>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
          <div className="max-w-md lg:sticky lg:top-28 lg:self-start">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary"><span className="h-px w-8 bg-primary/50" /> Dúvidas frequentes</span>
            <h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">
              Perguntas que as mamães mais fazem
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">Informações gerais para ajudar você a compreender os pontos mais comuns antes da análise individual.</p>
          </div>

          <div className="reveal-stagger space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="reveal-item overflow-hidden rounded-xl border border-border bg-card shadow-card">
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
                <div className={`overflow-hidden transition-all duration-[360ms] ease-out ${openFaq === i ? "max-h-60 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-5 pl-[3.25rem] text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FORMULÁRIO ═══════ */}
      <section id="formulario" data-experience-scene="compromisso" data-scene-direction="right" className="experience-scene bg-[#f3f6f8] py-20 sm:py-24 lg:py-28" ref={formRef}>
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="grid gap-4 border-b border-border pb-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary"><span className="h-px w-8 bg-primary/50" /> Atendimento</span>
            <div><h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">
              Como podemos te ajudar hoje?
            </h2>
            <p className="mt-3 text-muted-foreground">Escolha a opção que combina com você para agilizar seu atendimento.</p></div>
          </div>

          {/* Formulário Respondi incorporado */}
          <div
            id="formulario-respondi"
            className="relative mt-10 overflow-hidden rounded-2xl border border-primary/15 bg-card p-2 shadow-[0_24px_65px_-38px_rgba(8,42,68,0.45)] sm:p-5"
            onPointerDown={() => { trackEvent("form_started", { source: "secao_formulario" }); }}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-20 rounded-full bg-primary/10 blur-3xl" />
            <div
              data-respondi-container=""
              data-respondi-mode="regular"
              data-respondi-src="https://form.respondi.app/aymmBnHN"
              data-respondi-width="100%"
              data-respondi-height="600px"
              className="relative min-h-[600px] w-full overflow-hidden rounded-xl"
            />
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Ao continuar, você declara estar ciente da <Link to="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</Link> e dos <Link to="/termos-de-uso" className="text-primary hover:underline">Termos de Uso</Link>.
          </p>

          {/* CTA secundário — cliente existente */}
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center sm:flex-row sm:justify-between sm:text-left">
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
      <section className="bg-card py-20 sm:py-24 lg:py-28" ref={socialRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 border-b border-border pb-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary"><span className="h-px w-8 bg-primary/50" /> Depoimentos</span>
            <h2 className="font-serif text-3xl font-semibold leading-snug text-balance text-foreground sm:text-4xl">
              Experiências de quem já foi atendida
            </h2>
          </div>

          <div className="reveal-stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { quote: "Recebi meu benefício e veio em uma boa hora. Gratidão por tudo!", name: "Natanea Maria", stars: 5 },
              { quote: "Recebi muito antes do esperado. Atendimento excelente e muito carinhoso!", name: "Paola Machado", stars: 5 },
              { quote: "Me ajudaram muito, valeu a pena. Recomendo para todas as mamães!", name: "Heloisa Santos", stars: 5 },
            ].map(({ quote, name, stars }) => (
              <div key={name} className="reveal-item relative rounded-xl border border-border bg-[#f8fafb] px-7 py-7 shadow-card transition-shadow hover:shadow-card-hover">
                <span className="absolute right-6 top-4 font-serif text-5xl leading-none text-primary/10">“</span>
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
      <section className="relative overflow-hidden bg-[#0d2538] py-20 sm:py-24 lg:py-28" ref={ctaRef}>
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold leading-snug text-balance text-primary-foreground sm:text-3xl">
            Entenda seu caso com orientação especializada
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Faça uma análise inicial gratuita e receba uma orientação clara sobre os próximos passos do seu atendimento.
          </p>
          <button onClick={() => openFlow("cta_final")}
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-card px-8 py-4 text-base font-semibold text-primary shadow-card-hover transition-colors duration-200 hover:bg-secondary">
            Comece por aqui
            <ChevronRight className="h-4 w-4" />
          </button>
          <p className="mt-5 text-xs uppercase tracking-[0.14em] text-white/45">Análise inicial • Atendimento humano • Todo o Brasil</p>
        </div>
      </section>

      {/* ═══════ LOCALIZAÇÃO ═══════ */}
      <section id="localizacao" className="py-16 sm:py-20 lg:py-24" ref={locationRef}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover lg:grid-cols-[0.68fr_1.32fr]">
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
      <footer className="border-t border-white/10 bg-[#0d2538] pb-28 pt-14 text-white sm:pb-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="P&J Prev" width={112} height={112} loading="lazy" className="h-12 w-12 rounded-full object-cover shadow-card" />
                <span className="font-serif text-base font-semibold leading-tight text-white">P&amp;J Prev</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Cuidando dos seus direitos com carinho e dedicação. Atendimento em todo o Brasil.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Localização</h3>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("maps_clicked", { source: "footer" })} className="mt-3 flex items-start gap-2 text-sm text-white/60 transition-colors hover:text-white">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Recife - PE
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Contato</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0" /> (81) 3019-2443
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0" /> pejprevrecife@gmail.com
              </p>
              <a href="https://wa.me/558130192443" target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-sm text-white hover:underline">
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">CNPJ</h3>
              <p className="mt-3 text-sm text-white/60">38.381.395/0001-92</p>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
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
