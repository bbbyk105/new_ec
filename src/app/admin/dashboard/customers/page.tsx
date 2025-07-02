// app/admin/dashboard/customers/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Mail,
  Phone,
  Users,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";

// 顧客データの型定義
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastOrderDate: string;
  totalOrders: number;
  avatar: string;
}

// ダミーデータ
const customers: Customer[] = [
  {
    id: 1,
    name: "田中 太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    registrationDate: "2024-01-15",
    lastOrderDate: "2025-06-30",
    totalOrders: 12,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "佐藤 花子",
    email: "sato@example.com",
    phone: "080-9876-5432",
    registrationDate: "2024-03-22",
    lastOrderDate: "2025-06-29",
    totalOrders: 8,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "鈴木 一郎",
    email: "suzuki@example.com",
    phone: "070-1111-2222",
    registrationDate: "2023-11-10",
    lastOrderDate: "2025-06-29",
    totalOrders: 25,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "山田 美咲",
    email: "yamada@example.com",
    phone: "090-3333-4444",
    registrationDate: "2024-05-18",
    lastOrderDate: "2025-06-28",
    totalOrders: 6,
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 5,
    name: "高橋 拓也",
    email: "takahashi@example.com",
    phone: "080-5555-6666",
    registrationDate: "2024-02-05",
    lastOrderDate: "2025-04-15",
    totalOrders: 3,
    avatar: "/api/placeholder/40/40",
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    return matchesSearch;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(
      (c) =>
        new Date(c.lastOrderDate) >
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    ).length,
    inactive: customers.filter(
      (c) =>
        new Date(c.lastOrderDate) <=
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    ).length,
    newThisMonth: customers.filter((c) => {
      const registrationDate = new Date(c.registrationDate);
      const currentDate = new Date();
      return (
        registrationDate.getMonth() === currentDate.getMonth() &&
        registrationDate.getFullYear() === currentDate.getFullYear()
      );
    }).length,
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-900 min-h-screen">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            顧客管理
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            顧客情報の管理と分析を行えます
          </p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          新しい顧客を追加
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  総顧客数
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  今月の新規
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.newThisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルターと検索 */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="名前、メールアドレス、電話番号で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 顧客テーブル（デスクトップ） */}
      <Card className="bg-slate-800 border-slate-700 hidden md:block">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">
            顧客一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-750">
                  <TableHead className="text-slate-200 font-semibold px-6 py-4">
                    顧客情報
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    連絡先
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    登録日
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    最終注文日
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    注文数
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-slate-700 hover:bg-slate-750 transition-colors duration-150"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {customer.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            ID: {customer.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-slate-200">
                          {customer.email}
                        </p>
                        <p className="text-sm text-slate-400">
                          {customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {customer.registrationDate}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {customer.lastOrderDate}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 結果が見つからない場合の表示 */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2 font-medium">
                顧客が見つかりません
              </p>
              <p className="text-slate-400 text-sm">
                検索条件を変更するか、新しい顧客を追加してください
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 顧客カード（モバイル） */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        ID: {customer.id}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 ml-2 flex-shrink-0"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs text-slate-400">メール</p>
                      <p className="text-sm text-slate-200 truncate">
                        {customer.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">電話番号</p>
                      <p className="text-sm text-slate-200">{customer.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-400">登録日</p>
                      <p className="text-sm text-slate-200">
                        {customer.registrationDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">注文数</p>
                      <p className="text-sm font-medium text-white">
                        {customer.totalOrders}回
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">最終注文日</p>
                      <p className="text-sm text-slate-200">
                        {customer.lastOrderDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* モバイル版：結果が見つからない場合の表示 */}
        {filteredCustomers.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2 font-medium">
                顧客が見つかりません
              </p>
              <p className="text-slate-400 text-sm">
                検索条件を変更するか、新しい顧客を追加してください
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
