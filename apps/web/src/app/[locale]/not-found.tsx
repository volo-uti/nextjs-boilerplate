import { useTranslations } from "next-intl";
import { Link } from "@repo/shared/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link href="/" className="underline">
        {t("home")}
      </Link>
    </section>
  );
}
