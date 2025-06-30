// app/admin/dashboard/layout.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Loader2,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "売上",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    name: "商品",
    href: "/admin/dashboard/products",
    icon: Package,
  },
  {
    name: "注文",
    href: "/admin/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "顧客",
    href: "/admin/dashboard/customers",
    icon: Users,
  },
  {
    name: "分析",
    href: "/admin/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "設定",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (session && session.user.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-400">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  if (session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* サイドバー */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold">byPay</h1>
          </div>

          {/* ユーザー情報 */}
          <div className="flex items-center space-x-3 mb-8 p-3 bg-slate-700 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback>管理</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">管理者</p>
              <p className="text-sm text-slate-400">システム管理者</p>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                    isActive
                      ? "bg-slate-700 text-emerald-400"
                      : "hover:bg-slate-700 text-slate-300 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* フッター */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <div className="text-sm text-slate-400 hover:text-white cursor-pointer">
            ヘルプ
          </div>
          <div className="text-sm text-slate-400 hover:text-white cursor-pointer">
            お問い合わせ
          </div>
          <div
            className="text-sm text-slate-400 hover:text-white cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            ログアウト
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="ml-64">{children}</div>
    </div>
  );
}
