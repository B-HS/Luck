import type { PropsWithChildren } from "react";

export const Layout = ({
  children,
  title = "로또 6/45 추첨결과",
}: PropsWithChildren<{ title?: string }>) => (
  <html lang="ko">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <link rel="stylesheet" href="/globals.css" />
    </head>
    <body className="min-h-screen bg-background antialiased">
      <header className="border-b">
        <div className="max-w-2xl mx-auto p-4">
          <a href="/" className="text-xl font-bold hover:opacity-80">
            🎱 로또 6/45
          </a>
        </div>
      </header>
      <main className="py-6">{children}</main>
    </body>
  </html>
);
