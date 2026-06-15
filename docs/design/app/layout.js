import "./globals.css";

export const metadata = {
  title: "Pursuit - Discover real-life experiences in Nairobi",
  description:
    "Pursuit is a Nairobi-first event discovery platform for finding, saving, and planning real-life experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
