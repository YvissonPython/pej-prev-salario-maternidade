import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3, LogOut, Loader2, RefreshCw, Settings, ShieldAlert,
  MousePointerClick, MessageCircle, FileText, Users, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const logo = "https://pejprevsalariomaternidade.lovable.app/assets/logo-pjprev-circular-0AoflDRs.jpg";
import type { Session } from "@supabase/supabase-js";

type EventRow = {
  id: string;
  event_name: string;
  session_id: string;
  device: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

type SettingsRow = {
  ga_measurement_id: string;
  google_ads_conversion_id: string;
  google_ads_conversion_label: string;
  meta_pixel_id: string;
  gtm_container_id: string;
};

const emptySettings: SettingsRow = {
  ga_measurement_id: "",
  google_ads_conversion_id: "",
  google_ads_conversion_label: "",
  meta_pixel_id: "",
  gtm_container_id: "",
};

const RANGES = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

/* ══════════ LOGIN ══════════ */
const AdminLogin = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Conta criada! Confirme seu e-mail para acessar o painel.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card-hover">
        <div className="flex items-center gap-3">
          <img src={logo} alt="P&J Prev" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">Painel P&J Prev</h1>
            <p className="text-sm text-muted-foreground">Acesso restrito à equipe</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div>
            <label htmlFor="senha" className="text-sm font-medium text-foreground">Senha</label>
            <input id="senha" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          {msg && <p className="text-sm text-destructive">{msg}</p>}
          <button type="submit" disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-all hover:shadow-card-hover disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary">
          {mode === "signin" ? "Primeiro acesso? Criar conta de administrador" : "Já tenho conta — entrar"}
        </button>
      </div>
    </div>
  );
};

/* ══════════ DASHBOARD ══════════ */
const Dashboard = ({ session }: { session: Session }) => {
  const [tab, setTab] = useState<"dashboard" | "config">("dashboard");
  const [days, setDays] = useState(30);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsRow>(emptySettings);
  const [savingMsg, setSavingMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data } = await supabase
      .from("tracking_events")
      .select("id, event_name, session_id, device, referrer, utm_source, utm_medium, utm_campaign, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    setEvents((data as EventRow[]) ?? []);
    setLoading(false);
  }, [days]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    supabase.from("tracking_settings").select("*").eq("id", "default").maybeSingle().then(({ data }) => {
      if (data) {
        setSettings({
          ga_measurement_id: data.ga_measurement_id ?? "",
          google_ads_conversion_id: data.google_ads_conversion_id ?? "",
          google_ads_conversion_label: data.google_ads_conversion_label ?? "",
          meta_pixel_id: data.meta_pixel_id ?? "",
          gtm_container_id: data.gtm_container_id ?? "",
        });
      }
    });
  }, []);

  const stats = useMemo(() => {
    const count = (name: string) => events.filter((e) => e.event_name === name).length;
    const visitors = new Set(events.map((e) => e.session_id)).size;
    const pageViews = count("page_view");
    const ctas = count("cta_comece_aqui") + count("scroll_to_form");
    const flow = count("flow_opened");
    const novas = count("select_nova_cliente");
    const clientes = count("select_ja_cliente");
    const forms = count("form_opened");
    const zaps = count("whatsapp_clicked");

    const byKey = (fn: (e: EventRow) => string | null) => {
      const map = new Map<string, number>();
      events.forEach((e) => {
        const k = fn(e) || "(direto)";
        map.set(k, (map.get(k) ?? 0) + 1);
      });
      return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    };

    const perDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      perDay.set(d, 0);
    }
    events.forEach((e) => {
      const d = e.created_at.slice(0, 10);
      if (perDay.has(d)) perDay.set(d, (perDay.get(d) ?? 0) + 1);
    });

    return {
      visitors, pageViews, ctas, flow, novas, clientes, forms, zaps,
      devices: byKey((e) => e.device),
      sources: byKey((e) => e.utm_source),
      campaigns: byKey((e) => e.utm_campaign),
      perDay: [...perDay.entries()],
      conversionRate: visitors ? ((forms + zaps) / visitors) * 100 : 0,
    };
  }, [events, days]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMsg(null);
    const { error } = await supabase
      .from("tracking_settings")
      .update({
        ga_measurement_id: settings.ga_measurement_id.trim() || null,
        google_ads_conversion_id: settings.google_ads_conversion_id.trim() || null,
        google_ads_conversion_label: settings.google_ads_conversion_label.trim() || null,
        meta_pixel_id: settings.meta_pixel_id.trim() || null,
        gtm_container_id: settings.gtm_container_id.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "default");
    setSavingMsg(error ? `Erro ao salvar: ${error.message}` : "Configurações salvas com sucesso.");
  };

  const funnel = [
    { label: "Visitantes únicos", value: stats.visitors, icon: Users },
    { label: "Cliques em CTA", value: stats.ctas, icon: MousePointerClick },
    { label: "Identificação aberta", value: stats.flow, icon: BarChart3 },
    { label: "Formulário aberto", value: stats.forms, icon: FileText },
    { label: "WhatsApp (clientes)", value: stats.zaps, icon: MessageCircle },
  ];
  const funnelMax = Math.max(...funnel.map((f) => f.value), 1);
  const chartMax = Math.max(...stats.perDay.map(([, v]) => v), 1);

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="P&J Prev" className="h-9 w-9 rounded-full object-cover" />
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground">Painel administrativo</h1>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-primary">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </button>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 px-5">
          {([["dashboard", "Dashboard", BarChart3], ["config", "Rastreamento", Settings]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {tab === "dashboard" ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-2">
              {RANGES.map((r) => (
                <button key={r.days} onClick={() => setDays(r.days)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${days === r.days ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-primary"}`}>
                  {r.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Visitantes únicos", value: stats.visitors },
                { label: "Visualizações", value: stats.pageViews },
                { label: "Leads (formulário)", value: stats.forms },
                { label: "Taxa de conversão", value: `${stats.conversionRate.toFixed(1)}%` },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-foreground">{c.value}</p>
                </div>
              ))}
            </div>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-serif text-lg font-semibold text-foreground">Funil de conversão</h2>
              <div className="mt-5 space-y-3">
                {funnel.map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4 text-primary" /> {label}</span>
                      <span className="font-semibold text-foreground">{value}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-hero transition-all duration-500" style={{ width: `${(value / funnelMax) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-serif text-lg font-semibold text-foreground">Atividade diária</h2>
              <div className="mt-6 flex h-40 items-end gap-1">
                {stats.perDay.map(([d, v]) => (
                  <div key={d} className="group relative flex-1" title={`${d}: ${v} eventos`}>
                    <div className="w-full rounded-t bg-primary/70 transition-all hover:bg-primary" style={{ height: `${Math.max((v / chartMax) * 150, 2)}px` }} />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Total de eventos registrados nos últimos {days} dias.</p>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { title: "Dispositivos", rows: stats.devices },
                { title: "Origem (utm_source)", rows: stats.sources },
                { title: "Campanhas", rows: stats.campaigns },
              ].map(({ title, rows }) => (
                <section key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-serif text-base font-semibold text-foreground">{title}</h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {rows.length === 0 && <li className="text-muted-foreground">Sem dados no período.</li>}
                    {rows.map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between gap-3">
                        <span className="truncate text-muted-foreground">{k}</span>
                        <span className="font-semibold text-foreground">{v}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={saveSettings} className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">Rastreamento e conversões</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe os identificadores para ativar o rastreamento no site. Deixe em branco para desativar.
              </p>
            </div>

            <section className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
              <h3 className="font-serif font-semibold text-foreground">Status da captação</h3>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /> Eventos do site: ativos.</p>
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /> Formulário: Respondi (externo).</p>
                <p className="flex items-start gap-2 text-foreground"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> Sincronização de leads com CRM: não configurada neste projeto.</p>
              </div>
              <p className="mt-4 rounded-xl bg-card p-3 text-xs leading-relaxed text-muted-foreground">Recomendação: configurar um webhook do Respondi para o CRM de destino e realizar um envio controlado para confirmar o recebimento automático.</p>
            </section>

            <section className="rounded-2xl border border-border p-5">
              <h3 className="font-serif font-semibold text-foreground">Integrações</h3>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  ["Google Analytics", settings.ga_measurement_id],
                  ["Google Tag Manager", settings.gtm_container_id],
                  ["Google Ads", settings.google_ads_conversion_id && settings.google_ads_conversion_label],
                  ["Meta Pixel", settings.meta_pixel_id],
                ].map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 px-3 py-2.5">
                    <span className="text-foreground">{name}</span>
                    <span className={value ? "font-medium text-primary" : "font-medium text-amber-700"}>{value ? "Configurado" : "Não configurado"}</span>
                  </div>
                ))}
              </div>
            </section>
            {([
              ["ga_measurement_id", "Google Analytics 4 (G-XXXXXXX)"],
              ["gtm_container_id", "Google Tag Manager (GTM-XXXXXX)"],
              ["google_ads_conversion_id", "Google Ads — ID de conversão (AW-XXXXXXX)"],
              ["google_ads_conversion_label", "Google Ads — rótulo de conversão"],
              ["meta_pixel_id", "Meta Pixel (Facebook/Instagram)"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key} className="text-sm font-medium text-foreground">{label}</label>
                <input id={key} type="text" maxLength={120} value={settings[key]}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            ))}
            {savingMsg && <p className="text-sm text-primary">{savingMsg}</p>}
            <button type="submit" className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:shadow-card-hover">
              Salvar configurações
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

/* ══════════ PAGE ══════════ */
const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setIsAdmin(null); setChecking(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setChecking(true);
    supabase.rpc("claim_admin").then(({ data, error }) => {
      setIsAdmin(!error && data === true);
      setChecking(false);
    });
  }, [session]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/30 px-5 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" />
        <h1 className="font-serif text-xl font-semibold text-foreground">Acesso não autorizado</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Sua conta não tem permissão de administrador. Peça a um administrador para liberar seu acesso.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-primary">
          Sair
        </button>
      </div>
    );
  }

  return <Dashboard session={session} />;
};

export default Admin;
