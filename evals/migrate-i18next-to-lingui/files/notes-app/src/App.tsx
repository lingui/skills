import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";

export function App() {
  const { t, i18n } = useTranslation();
  const [notes, setNotes] = useState<string[]>(["Groceries", "Ideas"]);
  const userName = "Ada";

  const handleDelete = (index: number) => {
    if (window.confirm(t("actions.deleteConfirm"))) {
      setNotes(notes.filter((_, i) => i !== index));
    }
  };

  return (
    <main>
      <h1>{t("app.title")}</h1>
      <p>{t("app.subtitle")}</p>
      <p>
        <Trans i18nKey="welcome" values={{ name: userName }}>
          Hello <strong>{{ name: userName } as never}</strong>, ready to write?
        </Trans>
      </p>
      <p>{t("note", { count: notes.length })}</p>
      <button onClick={() => setNotes([...notes, ""])}>
        {t("actions.create")}
      </button>
      <ul>
        {notes.map((note, i) => (
          <li key={i}>
            {note}
            <button onClick={() => handleDelete(i)}>
              {t("actions.delete")}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => i18n.changeLanguage(i18n.language === "en" ? "de" : "en")}>
        {i18n.language === "en" ? "Deutsch" : "English"}
      </button>
    </main>
  );
}
