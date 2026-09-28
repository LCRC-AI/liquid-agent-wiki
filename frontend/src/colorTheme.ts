export const COLOR_THEMES = [
  { id: "sage", label: "Soft sage" },
  { id: "rose", label: "Soft rose" },
  { id: "sky", label: "Light blue" },
  { id: "stone", label: "Warm stone" },
] as const;

export type ColorTheme = typeof COLOR_THEMES[number]["id"];
const STORAGE_KEY = "liquid-agent-color-theme-v1";
const CHANGE_EVENT = "liquid-agent-color-theme-change";

function validatedTheme(value: unknown): ColorTheme {
  return COLOR_THEMES.find(theme => theme.id === value)?.id ?? "sage";
}

function savedTheme(): ColorTheme {
  try {
    return validatedTheme(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return "sage";
  }
}

export function initializeColorTheme(): void {
  document.documentElement.dataset.colorTheme = savedTheme();
}

export function currentColorTheme(): ColorTheme {
  return validatedTheme(document.documentElement.dataset.colorTheme);
}

export function setColorTheme(value: string): void {
  const theme = validatedTheme(value);
  document.documentElement.dataset.colorTheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Restricted storage must not prevent applying a theme for this page.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeColorTheme(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    initializeColorTheme();
    listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
