import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { currentLanguage, setLanguage, subscribeLanguage, t } from "./i18n";
import { COLOR_THEMES, currentColorTheme, setColorTheme, subscribeColorTheme } from "./colorTheme";
import "./portal-appearance.css";

type Choice = { value: string; label: string };

function HoverChoices({ label, value, choices, onChange, swatch = false }: {
  label: string; value: string; choices: Choice[]; onChange: (value: string) => void; swatch?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<Array<HTMLButtonElement | null>>([]);
  const focusOnOpen = useRef<number | null>(null);
  const hovered = useRef(false);
  const id = useId();
  const selected = Math.max(0, choices.findIndex(choice => choice.value === value));

  useEffect(() => {
    if (open && focusOnOpen.current !== null) {
      options.current[focusOnOpen.current]?.focus();
      focusOnOpen.current = null;
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return <div className="portal-choice" ref={root}
    onPointerEnter={event => { if (event.pointerType === "mouse") { hovered.current = true; setOpen(true); } }}
    onPointerLeave={() => { hovered.current = false; if (!root.current?.contains(document.activeElement) || document.activeElement === trigger.current) setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}
    onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    }}>
    <button ref={trigger} type="button" className={`portal-choice-trigger${swatch ? " portal-choice-theme" : ""}`}
      aria-label={label} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
      title={swatch ? `${label}: ${choices[selected].label}` : label}
      onClick={() => setOpen(current => hovered.current || !current)}
      onKeyDown={event => {
        if (["ArrowDown", "ArrowUp"].includes(event.key)) {
          event.preventDefault();
          const index = event.key === "ArrowUp" ? choices.length - 1 : selected;
          if (open) options.current[index]?.focus();
          else { focusOnOpen.current = index; setOpen(true); }
        }
      }}>
      {swatch ? <span className="portal-choice-swatch" data-swatch={value} aria-hidden="true" /> : <>{choices[selected].label}<span className="portal-choice-chevron" aria-hidden="true" /></>}
    </button>
    {open && <div className="portal-choice-popover"><div id={id} className="portal-choice-menu" role="menu" aria-label={label}>
      {choices.map((choice, index) => <button key={choice.value} type="button" role="menuitemradio"
        aria-checked={choice.value === value} tabIndex={index === selected ? 0 : -1}
        ref={element => { options.current[index] = element; }}
        onKeyDown={event => {
          const next = event.key === "ArrowDown" ? (index + 1) % choices.length : event.key === "ArrowUp" ? (index + choices.length - 1) % choices.length : event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : null;
          if (next !== null) { event.preventDefault(); options.current[next]?.focus(); }
        }}
        onClick={() => { onChange(choice.value); setOpen(false); trigger.current?.focus(); }}>
        {swatch && <span className="portal-choice-swatch" data-swatch={choice.value} aria-hidden="true" />}
        <span>{choice.label}</span><span className="portal-choice-check" aria-hidden="true">{choice.value === value ? "✓" : ""}</span>
      </button>)}
    </div></div>}
  </div>;
}

export function PortalAppearance({ showTheme = true }: { showTheme?: boolean }) {
  const language = useSyncExternalStore(subscribeLanguage, currentLanguage, () => "en");
  const theme = useSyncExternalStore(subscribeColorTheme, currentColorTheme, () => "sage");
  return <div className="portal-choice-group">
    <HoverChoices label={t("Interface language")} value={language} onChange={setLanguage}
      choices={[{ value: "en", label: "English" }, { value: "zh-CN", label: "中文" }]} />
    {showTheme && <HoverChoices label={t("Colour theme")} value={theme} onChange={setColorTheme} swatch
      choices={COLOR_THEMES.map(choice => ({ value: choice.id, label: t(choice.label) }))} />}
  </div>;
}
