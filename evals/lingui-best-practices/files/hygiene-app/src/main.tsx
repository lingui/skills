import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { messages } from "./locales/en/messages";
import { App } from "./App";

i18n.load("en", messages);
i18n.activate("en");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </StrictMode>
);
