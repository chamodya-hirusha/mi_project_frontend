/**
 * i18n.ts — Browser locale detection utility for TradeHub.lk
 *
 * Supported languages:
 *   en  → English  (default / fallback)
 *   si  → Sinhala  (Sri Lanka)
 *   ta  → Tamil    (Sri Lanka / India South)
 *
 * Detection priority:
 *   1. User's saved preference in localStorage ("tradehub_language")
 *   2. Browser navigator.language / navigator.languages list
 *   3. Fallback → "en"
 */

export type SupportedLocale = "en" | "si" | "ta";

/** Maps BCP-47 language tags to our supported locale codes */
const LOCALE_MAP: Record<string, SupportedLocale> = {
  // English variants
  en: "en",
  "en-US": "en",
  "en-GB": "en",
  "en-AU": "en",
  "en-CA": "en",
  "en-NZ": "en",
  "en-IN": "en",
  "en-SG": "en",
  "en-LK": "en",

  // Sinhala
  si: "si",
  sin: "si",
  "si-LK": "si",

  // Tamil variants
  ta: "ta",
  tam: "ta",
  "ta-LK": "ta",  // Sri Lankan Tamil
  "ta-IN": "ta",  // Indian Tamil
  "ta-SG": "ta",
  "ta-MY": "ta",
};

const STORAGE_KEY = "tradehub_language";

/**
 * Resolve a BCP-47 tag to a SupportedLocale.
 * Tries exact match first, then language-only prefix.
 */
export function resolveLocale(tag: string): SupportedLocale | null {
  // Exact match
  if (LOCALE_MAP[tag]) return LOCALE_MAP[tag];

  // Language prefix match (e.g. "si-Sinhalese" → "si")
  const prefix = tag.split("-")[0].toLowerCase();
  if (LOCALE_MAP[prefix]) return LOCALE_MAP[prefix];

  return null;
}

/**
 * Detect the best locale from the browser's language list.
 * Returns the first matched locale, or null if none match.
 */
export function detectBrowserLocale(): SupportedLocale | null {
  if (typeof navigator === "undefined") return null;

  const langs: readonly string[] =
    navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const lang of langs) {
    const resolved = resolveLocale(lang);
    if (resolved) return resolved;
  }

  return null;
}

/**
 * Get the initial locale to use on app startup.
 *
 * Priority:
 *  1. Saved user preference (localStorage)
 *  2. Browser locale detection
 *  3. Fallback → "en"
 */
export function getInitialLocale(): SupportedLocale {
  // 1. Saved preference
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    if (saved && (saved === "en" || saved === "si" || saved === "ta")) {
      return saved;
    }
  }

  // 2. Browser detection
  const detected = detectBrowserLocale();
  if (detected) return detected;

  // 3. Fallback
  return "en";
}

/**
 * Save the user's language preference to localStorage.
 */
export function saveLocalePreference(locale: SupportedLocale): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

/**
 * Get human-readable name for a locale code.
 */
export const LOCALE_NAMES: Record<SupportedLocale, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English",  nativeName: "English",  flag: "🇬🇧" },
  si: { name: "Sinhala",  nativeName: "සිංහල",    flag: "🇱🇰" },
  ta: { name: "Tamil",    nativeName: "தமிழ்",     flag: "🇱🇰" },
};
