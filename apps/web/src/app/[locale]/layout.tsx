import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { routing } from "@repo/shared/i18n/routing";
import { themeInitScript } from "@repo/ui/lib/theme";
import { SiteHeader } from "@repo/ui/organisms/site-header";
import { AppShell } from "@repo/ui/templates/app-shell";
import { AppProviders } from "@/shared/providers/app-providers";
import "../globals.css";

type LayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: { default: t("title"), template: `%s | ${t("title")}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Shell");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppProviders>
          <AppShell
            header={
              <SiteHeader
                title={t("title")}
                themeLabel={t("toggleTheme")}
                localeLabel={t("language")}
              />
            }
          >
            {children}
          </AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
