// app/admin/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-slate-900" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                管理者ダッシュボード
              </h1>
              <p className="text-slate-600">
                ようこそ、{session?.user?.email}さん
              </p>
            </div>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>ログアウト</span>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>商品管理</CardTitle>
              <CardDescription>商品の追加・編集・削除</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                商品管理機能は次のステップで実装予定です。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>注文管理</CardTitle>
              <CardDescription>注文の確認と処理</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                注文管理機能は今後実装予定です。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
              <CardDescription>売上と商品統計</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                統計機能は今後実装予定です。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
