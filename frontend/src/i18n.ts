import portalMessages from "./locales/portal.zh-CN.json";

export type Language = "en" | "zh-CN";
export const LANGUAGE_STORAGE_KEY = "liquid-agent-language-v1";
const CHANGE_EVENT = "liquid-agent-language-change";
const chinese: Record<string, string> = portalMessages;
let language: Language = "en";

function validLanguage(value: unknown): Language {
  return value === "zh-CN" ? "zh-CN" : "en";
}

export function initializeLanguage(): void {
  try {
    language = validLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    language = "en";
  }
  document.documentElement.lang = language;
}

export function currentLanguage(): Language {
  return language;
}

export function setLanguage(value: string): void {
  language = validLanguage(value);
  document.documentElement.lang = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // A restricted browser can still switch language for the current page.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeLanguage(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== LANGUAGE_STORAGE_KEY && event.key !== null) return;
    initializeLanguage();
    listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Translate explicit UI copy only. API values, user content and reports are not passed here.
export function t<T>(value: T, params?: Record<string, unknown>): T {
  if (typeof value !== "string") return value;
  const key = value.trim();
  const translated = language === "zh-CN" && Object.hasOwn(chinese, key) ? chinese[key] : undefined;
  let result = translated === undefined ? value : value.replace(key, () => translated);
  if (params) result = result.replace(/\{(\w+)\}/g, (token, name) =>
    Object.hasOwn(params, name) ? String(params[name] ?? "") : token);
  return result as T;
}

export function uiCount(count: number, singular: string, plural: string): string {
  return t(count === 1 ? singular : plural, { count });
}

export function formatUiDate(value: string): string {
  return new Date(value).toLocaleString(language === "en" ? "en-GB" : "zh-CN", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
