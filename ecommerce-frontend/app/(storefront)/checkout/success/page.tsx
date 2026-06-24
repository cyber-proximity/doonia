import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your payment…</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
