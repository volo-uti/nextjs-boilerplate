import { Link } from "@repo/shared/i18n/navigation";
import { LocaleSwitcher } from "../molecules/locale-switcher";
import { ThemeToggle } from "../molecules/theme-toggle";

type SiteHeaderProps = {
  title: string;
  themeLabel: string;
  localeLabel: string;
};

/** Page header with the home link, locale switcher and theme toggle; all labels are passed in already translated. */
export function SiteHeader({ title, themeLabel, localeLabel }: SiteHeaderProps) {
  return (
    <header className="border-b">
      <div className="h-14 max-w-5xl px-4 mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold">
          {title}
        </Link>
        <div className="gap-2 flex items-center">
          <LocaleSwitcher label={localeLabel} />
          <ThemeToggle label={themeLabel} />
        </div>
      </div>
    </header>
  );
}
