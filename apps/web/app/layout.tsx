import "./globals.css";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import "@mantine/charts/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/carousel/styles.layer.css";
import "@mantine/dropzone/styles.layer.css";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`antialiased min-h-screen h-full min-w-screen w-full flex flex-col  relative `}
      >
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
