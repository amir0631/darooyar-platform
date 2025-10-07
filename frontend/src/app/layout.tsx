// frontend/src/app/layout.tsx
// ورژن ۱.۲
// قرار دادن کل اپلیکیشن داخل AuthProvider

import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext"; 
import ThemeRegistry from "@/theme/ThemeRegistry";
import "./globals.css";
import localFont from 'next/font/local';
import { NotificationProvider } from '@/context/NotificationContext'; // <-- ایمپورت کردن Provider جدید

const vazirFont = localFont({
  src: '../fonts/Vazirmatn-Variable.woff2',
  display: 'swap',
  variable: '--font-vazir',
});

export const metadata: Metadata = {
  title: "پلتفرم دارویار",
  description: "پلتفرم هوشمند تبادل داروهای مازاد و نزدیک به انقضا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirFont.variable} ${vazirFont.className}`}>
        <AuthProvider>
          <ThemeRegistry>
             <NotificationProvider>
              <main>{children}</main>
            </NotificationProvider> 
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}