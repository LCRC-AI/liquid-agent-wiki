import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { initializeColorTheme } from "./colorTheme";
import { initializeLanguage } from "./i18n";
import "./styles.css";
import "./theme.css";
import "./liquid-portal.css";

initializeColorTheme();
initializeLanguage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
