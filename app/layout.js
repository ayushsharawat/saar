import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import Footer from "./_components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SaaR.ai - AI-Powered Search Engine",
  description: "Advanced AI-powered search engine with web search, image search, and intelligent analysis",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <Provider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex flex-col min-h-screen">
                <SidebarTrigger />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
