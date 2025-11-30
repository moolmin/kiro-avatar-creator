import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Local font configurations
const awsDiatype = localFont({
  src: [
    {
      path: "../public/fonts/AWSDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/AWSDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aws-diatype",
});

const awsDiatypeRounded = localFont({
  src: [
    {
      path: "../public/fonts/AWSDiatypeRoundedSemi-Mono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/AWSDiatypeRoundedSemi-Mono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aws-diatype-rounded",
});

export const metadata: Metadata = {
  title: "Kiroween Avatar Maker",
  description: "Create customized ghost avatars for Halloween",
  openGraph: {
    title: "Kiroween Avatar Maker",
    description: "Create customized ghost avatars for Halloween",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiroween Avatar Maker",
    description: "Create customized ghost avatars for Halloween",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${awsDiatype.variable} ${awsDiatypeRounded.variable}`}>
      <body className={awsDiatypeRounded.className} style={{fontFamily: 'var(--font-aws-diatype-rounded)'}}>{children}</body>
    </html>
  );
}
