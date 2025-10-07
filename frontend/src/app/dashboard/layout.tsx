// frontend/src/app/dashboard/layout.tsx
// ورژن ۱.۰
// اعمال ساختار داشبورد به تمام صفحات فرزند

import DashboardLayout from "@/components/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}