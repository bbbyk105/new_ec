// app/admin/dashboard/customers/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Users,
  UserPlus,
  Star,
  Calendar,
} from "lucide-react";

// ダミーデータ
const customers = [
  {
    id: 1,
    name: "田中 太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    registrationDate: "2024-01-15",
    lastOrderDate: "2025-06-30",
    totalOrders: 12,
    totalSpent: 145600,
    status: "active",
    customerTier: "gold",
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
    totalSpent: 89300,
    status: "active",
    customerTier: "silver",
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
    totalSpent: 234500,
    status: "active",
    customerTier: "platinum",
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
    totalSpent: 67800,
    status: "active",
    customerTier: "bronze",
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
    totalSpent: 23400,
    status: "inactive",
    customerTier: "bronze",
    avatar: "/api/placeholder/40/40",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 text-white">アクティブ</Badge>;
    case "inactive":
      return <Badge className="bg-yellow-500 text-white">非アクティブ</Badge>;
    case "suspended":
      return <Badge className="bg-red-500 text-white">停止中</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">不明</Badge>;
  }
};

const getTierBadge = (tier: string) => {
  switch (tier) {
    case "platinum":
      return <Badge className="bg-purple-500 text-white">プラチナ</Badge>;
    case "gold":
      return <Badge className="bg-yellow-500 text-white">ゴールド</Badge>;
    case "silver":
      return <Badge className="bg-gray-500 text-white">シルバー</Badge>;
    case "bronze":
      return <Badge className="bg-orange-500 text-white">ブロンズ</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">一般</Badge>;
  }
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    const matchesTier =
      tierFilter === "all" || customer.customerTier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
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
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">顧客管理</h1>
          <p className="text-slate-400">顧客情報の管理と分析を行えます</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <UserPlus className="w-4 h-4 mr-2" />
          新しい顧客を追加
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">総顧客数</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">アクティブ</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">非アクティブ</p>
                <p className="text-2xl font-bold text-white">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">今月の新規</p>
                <p className="text-2xl font-bold text-white">
                  {stats.newThisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルターと検索 */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="名前、メールアドレス、電話番号で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                <SelectValue placeholder="ステータスで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                <SelectItem value="active">アクティブ</SelectItem>
                <SelectItem value="inactive">非アクティブ</SelectItem>
                <SelectItem value="suspended">停止中</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                <SelectValue placeholder="ティアで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのティア</SelectItem>
                <SelectItem value="platinum">プラチナ</SelectItem>
                <SelectItem value="gold">ゴールド</SelectItem>
                <SelectItem value="silver">シルバー</SelectItem>
                <SelectItem value="bronze">ブロンズ</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              詳細フィルター
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 顧客テーブル */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">顧客一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">顧客情報</TableHead>
                <TableHead className="text-slate-300">連絡先</TableHead>
                <TableHead className="text-slate-300">登録日</TableHead>
                <TableHead className="text-slate-300">最終注文日</TableHead>
                <TableHead className="text-slate-300">注文数</TableHead>
                <TableHead className="text-slate-300">総購入額</TableHead>
                <TableHead className="text-slate-300">ティア</TableHead>
                <TableHead className="text-slate-300">ステータス</TableHead>
                <TableHead className="text-slate-300">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-slate-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
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
                      <p className="text-sm text-slate-300">{customer.email}</p>
                      <p className="text-sm text-slate-400">{customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {customer.registrationDate}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {customer.lastOrderDate}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    ¥{customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>{getTierBadge(customer.customerTier)}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
