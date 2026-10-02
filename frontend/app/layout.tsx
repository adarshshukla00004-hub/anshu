import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CareerForge | AI Career Readiness & Placement Platform",
  description:
    "Next-generation placement accelerator with ATS resume skill-gap diagnostics, dynamic milestone learning roadmap, voice/text AI mock interview room, and localized internship matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 flex antialiased">
        {/* Persistent Shell Sidebar */}
        <Sidebar />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 lg:px-12 bg-gradient-to-b from-[#0b0f19] via-[#070b14] to-[#05070d]">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
