import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { checkUser } from "@/lib/checkUser"; // Import the sync function
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Career Coach",
  description: "AI-powered career coaching and growth tools.",
};

// Make the layout async to allow server-side database sync
export default async function RootLayout({ children }) {
  // This triggers the upsert logic to sync Clerk user with Neon DB
  await checkUser(); 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />

          {/* Added pt-16 to prevent content from hiding under the fixed header */}
          <main className="min-h-screen pt-16">{children}</main>
          <Toaster richColours/>
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>Made By Brahmatej Reddy</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}