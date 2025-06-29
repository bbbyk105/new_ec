// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // まだロード中

    if (status === "unauthenticated") {
      // 認証されていない場合はログインページにリダイレクト
      router.push("/admin/login");
      return;
    }

    if (session) {
      // 認証されている場合はダッシュボードにリダイレクト
      router.push("/admin/dashboard");
    }
  }, [session, status, router]);

  // ローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-600" />
        <p className="text-slate-600">認証状態を確認中...</p>
      </div>
    </div>
  );
}
