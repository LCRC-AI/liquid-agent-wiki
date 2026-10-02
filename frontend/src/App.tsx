import { useEffect, useState, useSyncExternalStore } from "react";
import { LiquidPortal } from "./LiquidPortal";
import { currentLanguage, subscribeLanguage } from "./i18n";

export function App() {
  useSyncExternalStore(subscribeLanguage, currentLanguage, () => "en");
  const [route, setRoute] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return <LiquidPortal route={route} />;
}
