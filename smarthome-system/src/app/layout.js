import Head from "next/head";
import "./globals.css";

export const metadata = {
  title: "Smarthome-System",
  description: "DIY Smarthome-System",
  icons: {
    icon: "/logo.svg"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
