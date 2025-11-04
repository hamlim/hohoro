import type { ReactNode } from "react";

function themeCheck() {
  let prefersDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let preferred = prefersDarkModeQuery.matches ? "dark" : "light";
  document.documentElement.classList.add(preferred);
  prefersDarkModeQuery.addEventListener("change", (e) => {
    let newPreferred = e.matches ? "dark" : "light";
    document.documentElement.classList.remove(preferred);
    document.documentElement.classList.add(newPreferred);
    preferred = newPreferred;
  });
}

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Inject theme handling code early
          dangerouslySetInnerHTML={{ __html: `(${themeCheck.toString()})()` }}
        />
        {children}
      </body>
    </html>
  );
}
