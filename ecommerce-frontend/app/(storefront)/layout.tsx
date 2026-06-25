import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <Breadcrumb />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
