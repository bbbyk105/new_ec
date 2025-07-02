// app/admin/dashboard/layout.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Loader2,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  HelpCircle,
  MessageCircle,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // モバイルでサイドバーが開いているときは、背景をクリックで閉じる
  const handleBackdropClick = () => {
    setSidebarOpen(false);
  };

  // ナビゲーションアイテムクリック時にモバイルではサイドバーを閉じる
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

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
      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* サイドバー */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700 z-50 transition-all duration-300 ease-in-out",
          // モバイル用の設定
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // デスクトップ用の設定（折りたたみ対応）
          "lg:block",
          sidebarCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー部分 */}
          <div
            className={cn("p-6 lg:p-4", sidebarCollapsed ? "lg:p-2" : "lg:p-6")}
          >
            <div
              className={cn(
                "flex items-center justify-between",
                sidebarCollapsed ? "mb-4" : "mb-8 lg:mb-6"
              )}
            >
              <div className="flex items-center space-x-3">
                {!sidebarCollapsed && (
                  <h1 className="text-xl font-bold hidden lg:block">byPay</h1>
                )}
                <h1 className="text-2xl font-bold lg:hidden">byPay</h1>
              </div>

              {/* デスクトップ用折りたたみボタン */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden lg:flex text-slate-400 hover:text-white transition-all duration-200",
                  sidebarCollapsed
                    ? "w-12 h-12 p-0 items-center justify-center"
                    : "p-1 h-8 w-8"
                )}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* モバイル用閉じるボタン */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-400 hover:text-white p-2 h-10 w-10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* ユーザー情報 */}
            <div
              className={cn(
                "flex items-center rounded-lg transition-all duration-300",
                "mb-8 lg:mb-6 p-4 lg:p-3",
                sidebarCollapsed
                  ? "lg:justify-center lg:p-2"
                  : "space-x-4 lg:space-x-3"
              )}
            >
              <Avatar
                className={cn(
                  "flex-shrink-0",
                  sidebarCollapsed ? "w-8 h-8" : "w-12 h-12 lg:w-10 lg:h-10"
                )}
              >
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback className="text-gray-700 text-base lg:text-sm">
                  管理
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="min-w-0 lg:block hidden">
                  <p className="font-medium text-sm truncate">管理者</p>
                  <p className="text-xs text-slate-400 truncate">
                    システム管理者
                  </p>
                </div>
              )}
              <div className="min-w-0 lg:hidden">
                <p className="font-medium text-base truncate">管理者</p>
                <p className="text-sm text-slate-400 truncate">
                  システム管理者
                </p>
              </div>
            </div>

            {/* ナビゲーション */}
            <nav className="space-y-2 lg:space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center rounded-lg cursor-pointer transition-all duration-200 relative group",
                      "hover:bg-slate-700",
                      isActive
                        ? "bg-slate-700 text-emerald-400"
                        : "text-slate-300 hover:text-white",
                      sidebarCollapsed
                        ? "lg:justify-center lg:w-12 lg:h-12 lg:p-0"
                        : "px-4 py-3 lg:px-3 lg:py-2 space-x-4 lg:space-x-3"
                    )}
                  >
                    <Icon className="w-6 h-6 lg:w-5 lg:h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="hidden lg:block text-sm">
                        {item.name}
                      </span>
                    )}
                    <span className="lg:hidden text-base font-medium">
                      {item.name}
                    </span>

                    {/* 折りたたみ時のツールチップ */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden lg:block">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* フッター */}
          <div
            className={cn(
              "mt-auto space-y-2 lg:space-y-1",
              "p-6 lg:p-4",
              sidebarCollapsed ? "lg:p-2" : "lg:p-6"
            )}
          >
            {!sidebarCollapsed ? (
              <>
                <button className="items-center space-x-3 w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-200 hidden lg:flex">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                  <span>ヘルプ</span>
                </button>
                <button className="items-center space-x-3 w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-200 hidden lg:flex">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>お問い合わせ</span>
                </button>
                <button
                  className="items-center space-x-3 w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-200 hidden lg:flex"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>ログアウト</span>
                </button>

                {/* モバイル用フッター */}
                <div className="lg:hidden space-y-2">
                  <button className="flex items-center space-x-4 w-full text-left px-4 py-3 text-base text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-200">
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    <span>ヘルプ</span>
                  </button>
                  <button className="flex items-center space-x-4 w-full text-left px-4 py-3 text-base text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-200">
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    <span>お問い合わせ</span>
                  </button>
                  <button
                    className="flex items-center space-x-4 w-full text-left px-4 py-3 text-base text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-all duration-200"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>ログアウト</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-col items-center space-y-2 hidden lg:flex">
                <button
                  className="text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-slate-700 w-12 h-12 flex items-center justify-center transition-all duration-200 group relative"
                  title="ヘルプ"
                >
                  <HelpCircle className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    ヘルプ
                  </div>
                </button>
                <button
                  className="text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-slate-700 w-12 h-12 flex items-center justify-center transition-all duration-200 group relative"
                  title="お問い合わせ"
                >
                  <MessageCircle className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    お問い合わせ
                  </div>
                </button>
                <button
                  className="text-slate-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-slate-700 w-12 h-12 flex items-center justify-center transition-all duration-200 group relative"
                  title="ログアウト"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOut className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    ログアウト
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* トップバー（モバイル用） */}
      <div className="lg:hidden bg-slate-800 border-b border-slate-700 p-5 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white p-2 h-10 w-10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <Shield className="w-7 h-7 text-emerald-400" />
            <h1 className="text-xl font-bold">byPay</h1>
          </div>
          <div className="w-10" /> {/* スペーサー */}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          // モバイル
          "pt-20 lg:pt-0",
          // デスクトップ
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
