import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { OnboardingProvider } from "@/features/onboarding";
import { BrandProvider } from "@/features/brand-management";
import { SchedulerProvider } from "@/features/scheduling";
import { CampaignProvider } from "@/features/campaigns";
import { ContentLibraryProvider } from "@/features/content-library";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Pulse - AI-Powered Social Media Management",
  description: "Discover trends, generate content, and grow your social media presence with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider>
          <QueryProvider>
            <OnboardingProvider>
              <BrandProvider>
                <SchedulerProvider>
                  <CampaignProvider>
                    <ContentLibraryProvider>
                      {children}
                    </ContentLibraryProvider>
                  </CampaignProvider>
                </SchedulerProvider>
              </BrandProvider>
            </OnboardingProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
