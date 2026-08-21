import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import ThemeProvider from "@/components/theme";
import AppDataProvider from "@/components/appdataprovider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AppDataProvider>
            <Sidebar />

            <div className="ml-60">
              <Navbar />

              <main className="p-8">
                {children}
              </main>
            </div>
          </AppDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}