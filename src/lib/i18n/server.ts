import { cookies } from "next/headers";
import { Language, translations } from "./translations";

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "en") as Language;

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return { t, lang, isRTL: lang === "fa" };
}
