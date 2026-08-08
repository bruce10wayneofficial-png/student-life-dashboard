import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />

        <div className="ml-60">
          <Navbar />

          <main className="p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}