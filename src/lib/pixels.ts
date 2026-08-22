import { supabase } from "@/integrations/supabase/client";
import { CONSENT_KEY } from "@/components/CookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; callMethod?: (...args: unknown[]) => void };
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackingSettings = {
  ga_measurement_id: string | null;
  google_ads_conversion_id: string | null;
  google_ads_conversion_label: string | null;
  meta_pixel_id: string | null;
  gtm_container_id: string | null;
};

let cached: TrackingSettings | null = null;
let initialized = false;
const fired = new Set<string>();

const metricsAllowed = () => localStorage.getItem(CONSENT_KEY) === "metrics";

function addScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initGtag(id: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer!.push(args));
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  addScript(`gtag-${id}`, `https://www.googletagmanager.com/gtag/js?id=${id}`);
}

function initGtm(id: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  addScript(`gtm-${id}`, `https://www.googletagmanager.com/gtm.js?id=${id}`);
}

function initMetaPixel(id: string) {
  if (window.fbq?.loaded) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  window.fbq = fbq;
  window._fbq = fbq;
  addScript("meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", id);
  fbq("track", "PageView");
}

async function fetchSettings() {
  if (cached) return cached;
  const { data } = await supabase
    .from("tracking_settings")
    .select("ga_measurement_id, google_ads_conversion_id, google_ads_conversion_label, meta_pixel_id, gtm_container_id")
    .eq("id", "default")
    .maybeSingle();
  cached = (data as TrackingSettings | null) ?? null;
  return cached;
}

export async function loadPixels(): Promise<TrackingSettings | null> {
  if (!metricsAllowed()) return null;
  try {
    const settings = await fetchSettings();
    if (!settings || initialized) return settings;
    initialized = true;
    if (settings.gtm_container_id) initGtm(settings.gtm_container_id);
    if (settings.ga_measurement_id) initGtag(settings.ga_measurement_id);
    if (settings.google_ads_conversion_id) initGtag(settings.google_ads_conversion_id);
    if (settings.meta_pixel_id) initMetaPixel(settings.meta_pixel_id);
    return settings;
  } catch {
    return null;
  }
}

export function listenForConsent() {
  const handler = (event: Event) => {
    const choice = (event as CustomEvent<string>).detail;
    if (choice === "metrics") void loadPixels();
  };
  window.addEventListener("pj:consent-changed", handler);
  return () => window.removeEventListener("pj:consent-changed", handler);
}

export function fireConversion(eventName: "CTAStart" | "Lead" | "Contact") {
  if (!metricsAllowed()) return;
  const key = `${eventName}:${location.pathname}`;
  if (fired.has(key)) return;
  fired.add(key);
  try {
    if (eventName === "Lead" && cached?.google_ads_conversion_id && cached.google_ads_conversion_label && window.gtag) {
      window.gtag("event", "conversion", { send_to: `${cached.google_ads_conversion_id}/${cached.google_ads_conversion_label}` });
    }
    window.gtag?.("event", eventName);
    if (window.fbq) {
      if (eventName === "CTAStart") window.fbq("trackCustom", "CTAStart");
      else window.fbq("track", eventName);
    }
  } catch {
    // Métricas não podem interromper a experiência.
  }
}
