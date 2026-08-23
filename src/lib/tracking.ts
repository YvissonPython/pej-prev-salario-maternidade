import { supabase } from "@/integrations/supabase/client";

export type TrackingEventName =
  | "page_view"
  | "cta_comece_aqui"
  | "flow_opened"
  | "select_nova_cliente"
  | "select_ja_cliente"
  | "form_opened"
  | "form_started"
  | "lead_completed"
  | "whatsapp_clicked"
  | "instagram_clicked"
  | "maps_clicked"
  | "scroll_to_form"
  | "faq_opened";

const SESSION_KEY = "pj_session_id";
const UTM_KEY = "pj_utm";

type Utm = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function getDevice(): string {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function captureUtm(): Utm {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
  const found: Utm = {};
  let hasAny = false;
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) {
      found[k] = v;
      hasAny = true;
    }
  });

  try {
    if (hasAny) {
      localStorage.setItem(UTM_KEY, JSON.stringify(found));
      return found;
    }
    const stored = localStorage.getItem(UTM_KEY);
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return found;
  }
}

export async function trackEvent(
  eventName: TrackingEventName,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    const utm = captureUtm();
    await supabase.from("tracking_events").insert({
      event_name: eventName,
      session_id: getSessionId(),
      page: window.location.pathname,
      device: getDevice(),
      referrer: document.referrer || null,
      user_agent: navigator.userAgent.slice(0, 300),
      metadata: metadata as never,
      ...utm,
    });
  } catch (err) {
    console.warn("tracking failed", err);
  }
}
