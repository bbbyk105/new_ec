// components/providers/toaster-provider.tsx
"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: "#1e293b", // slate-800
          color: "#f8fafc", // slate-50
          border: "1px solid #334155", // slate-700
        },
        className: "sonner-toast",
      }}
    />
  );
}
