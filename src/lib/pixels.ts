import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...a: unknown[]) => void; push?: unknown };
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
  }
}

const injected = new Set<string>();

function addScript(id: string, src: string) {
  if (injected.has(id) || document.getElementById(id)) return;
  injected.add(id);
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function initGtag(id: string) {
  addScript(`gtag-${id}`, `https://www.googletagmanager.com/gtag/js?id=${id}`);
  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  window.gtag = window.gtag || gtag;
  window.gtag("js", new Date());
  window.gtag("config", id);
}

function initGtm(id: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  addScript(`gtm-${id}`, `https://www.googletagmanager.com/gtm.js?id=${id}`);
}

function initMetaPixel(id: string) {
  if (injected.has(`fb-${id}`)) return;
  injected.add(`fb-${id}`);
  const queue: unknown[] = [];
  const fbq = ((...args: unknown[]) => {
    queue.push(args);
  }) as NonNullable<Window["fbq"]>;
  fbq.queue = queue;
  window.fbq = window.fbq || fbq;
  addScript(`fb-script-${id}`, "https://connect.facebook.net/en_US/fbevents.js");
  const check = window.setInterval(() => {
    const realFbq = window.fbq;
    if (realFbq && (realFbq as { loaded?: boolean }).loaded) {
      window.clearInterval(check);
      realFbq("init", id);
      realFbq("track", "PageView");
    }
  }, 200);
  window.setTimeout(() => window.clearInterval(check), 10000);
}

export type TrackingSettings = {
  ga_measurement_id: string | null;
  google_ads_conversion_id: string | null;
  google_ads_conversion_label: string | null;
  meta_pixel_id: string | null;
  gtm_container_id: string | null;
};

let cached: TrackingSettings | null = null;

export async function loadPixels(): Promise<TrackingSettings | null> {
  try {
    const { data } = await supabase
      .from("tracking_settings")
      .select("ga_measurement_id, google_ads_conversion_id, google_ads_conversion_label, meta_pixel_id, gtm_container_id")
      .eq("id", "default")
      .maybeSingle();
    if (!data) return null;
    cached = data as TrackingSettings;
    if (data.gtm_container_id) initGtm(data.gtm_container_id);
    if (data.ga_measurement_id) initGtag(data.ga_measurement_id);
    if (data.google_ads_conversion_id) initGtag(data.google_ads_conversion_id);
    if (data.meta_pixel_id) initMetaPixel(data.meta_pixel_id);
    return cached;
  } catch {
    return null;
  }
}

export function fireConversion(eventName: string) {
  try {
    if (cached?.google_ads_conversion_id && cached.google_ads_conversion_label && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `${cached.google_ads_conversion_id}/${cached.google_ads_conversion_label}`,
      });
    }
    if (window.gtag) window.gtag("event", eventName);
    if (window.fbq) window.fbq("track", "Lead", { content_name: eventName });
  } catch {
    /* noop */
  }
}
