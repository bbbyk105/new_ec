// app/admin/dashboard/orders/page.tsx
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
  Truck,
  Clock,
  CheckCircle,
  ShoppingCart,
  Package,
} from "lucide-react";

// ダミーデータ
const orders = [
  {
    id: "ORD-2025-001",
    customer: "田中 太郎",
    email: "tanaka@example.com",
    date: "2025-06-30",
    items: 3,
    total: 24800,
    status: "pending",
    paymentStatus: "paid",
    shippingAddress: "東京都渋谷区...",
  },
  {
    id: "ORD-2025-002",
    customer: "佐藤 花子",
    email: "sato@example.com",
    date: "2025-06-29",
    items: 1,
    total: 8900,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "大阪府大阪市...",
  },
  {
    id: "ORD-2025-003",
    customer: "鈴木 一郎",
    email: "suzuki@example.com",
    date: "2025-06-29",
    items: 2,
    total: 16400,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "愛知県名古屋市...",
  },
  {
    id: "ORD-2025-004",
    customer: "山田 美咲",
    email: "yamada@example.com",
    date: "2025-06-28",
    items: 4,
    total: 32100,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "福岡県福岡市...",
  },
  {
    id: "ORD-2025-005",
    customer: "高橋 拓也",
    email: "takahashi@example.com",
    date: "2025-06-28",
    items: 1,
    total: 15600,
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: "北海道札幌市...",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500 text-white">処理待ち</Badge>;
    case "processing":
      return <Badge className="bg-blue-500 text-white">処理中</Badge>;
    case "shipped":
      return <Badge className="bg-purple-500 text-white">配送中</Badge>;
    case "delivered":
      return <Badge className="bg-green-500 text-white">配送済み</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500 text-white">キャンセル</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">不明</Badge>;
  }
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-500 text-white">支払済み</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 text-white">支払待ち</Badge>;
    case "refunded":
      return <Badge className="bg-blue-500 text-white">返金済み</Badge>;
    case "failed":
      return <Badge className="bg-red-500 text-white">支払失敗</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white">不明</Badge>;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">注文管理</h1>
          <p className="text-slate-400">
            顧客からの注文を管理し、配送状況を追跡できます
          </p>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">総注文数</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">処理待ち</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">処理中</p>
                <p className="text-2xl font-bold text-white">
                  {stats.processing}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">配送中</p>
                <p className="text-2xl font-bold text-white">{stats.shipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">配送済み</p>
                <p className="text-2xl font-bold text-white">
                  {stats.delivered}
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
                placeholder="注文ID、顧客名、メールアドレスで検索..."
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
                <SelectItem value="pending">処理待ち</SelectItem>
                <SelectItem value="processing">処理中</SelectItem>
                <SelectItem value="shipped">配送中</SelectItem>
                <SelectItem value="delivered">配送済み</SelectItem>
                <SelectItem value="cancelled">キャンセル</SelectItem>
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

      {/* 注文テーブル */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">注文一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">注文ID</TableHead>
                <TableHead className="text-slate-300">顧客情報</TableHead>
                <TableHead className="text-slate-300">注文日</TableHead>
                <TableHead className="text-slate-300">商品数</TableHead>
                <TableHead className="text-slate-300">合計金額</TableHead>
                <TableHead className="text-slate-300">注文ステータス</TableHead>
                <TableHead className="text-slate-300">
                  支払いステータス
                </TableHead>
                <TableHead className="text-slate-300">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{order.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{order.customer}</p>
                      <p className="text-sm text-slate-400">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{order.date}</TableCell>
                  <TableCell className="text-slate-300">
                    {order.items}点
                  </TableCell>
                  <TableCell className="text-slate-300">
                    ¥{order.total.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Select>
                        <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600">
                          <SelectValue placeholder="ステータス変更" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">処理待ち</SelectItem>
                          <SelectItem value="processing">処理中</SelectItem>
                          <SelectItem value="shipped">配送中</SelectItem>
                          <SelectItem value="delivered">配送済み</SelectItem>
                          <SelectItem value="cancelled">キャンセル</SelectItem>
                        </SelectContent>
                      </Select>
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
