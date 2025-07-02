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
  Eye,
  Truck,
  Clock,
  CheckCircle,
  ShoppingCart,
  Package,
  MoreHorizontal,
} from "lucide-react";

// 注文データの型定義
interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
}

// ダミーデータ
const orders: Order[] = [
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
      return (
        <Badge className="bg-yellow-500 text-white font-medium text-xs">
          処理待ち
        </Badge>
      );
    case "processing":
      return (
        <Badge className="bg-blue-500 text-white font-medium text-xs">
          処理中
        </Badge>
      );
    case "shipped":
      return (
        <Badge className="bg-purple-500 text-white font-medium text-xs">
          配送中
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-green-500 text-white font-medium text-xs">
          配送済み
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-500 text-white font-medium text-xs">
          キャンセル
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500 text-white font-medium text-xs">
          不明
        </Badge>
      );
  }
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-green-500 text-white font-medium text-xs">
          支払済み
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-500 text-white font-medium text-xs">
          支払待ち
        </Badge>
      );
    case "refunded":
      return (
        <Badge className="bg-blue-500 text-white font-medium text-xs">
          返金済み
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-500 text-white font-medium text-xs">
          支払失敗
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500 text-white font-medium text-xs">
          不明
        </Badge>
      );
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
    <div className="p-4 sm:p-6 bg-slate-900 min-h-screen">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
            注文管理
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            顧客からの注文を管理し、配送状況を追跡できます
          </p>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  総注文数
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  処理待ち
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  処理中
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats.processing}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  配送中
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats.shipped}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200 col-span-2 sm:col-span-3 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  配送済み
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルターと検索 */}
      <Card className="bg-slate-800 border-slate-700 mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* 検索バー */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="注文ID、顧客名、メールアドレスで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 text-sm sm:text-base"
              />
            </div>

            {/* フィルター */}
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 sm:max-w-xs bg-slate-700 border-slate-600 text-white focus:border-emerald-500 focus:ring-emerald-500 text-sm sm:text-base">
                  <SelectValue placeholder="ステータスで絞り込み" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-slate-600"
                  >
                    すべてのステータス
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="text-white hover:bg-slate-600"
                  >
                    処理待ち
                  </SelectItem>
                  <SelectItem
                    value="processing"
                    className="text-white hover:bg-slate-600"
                  >
                    処理中
                  </SelectItem>
                  <SelectItem
                    value="shipped"
                    className="text-white hover:bg-slate-600"
                  >
                    配送中
                  </SelectItem>
                  <SelectItem
                    value="delivered"
                    className="text-white hover:bg-slate-600"
                  >
                    配送済み
                  </SelectItem>
                  <SelectItem
                    value="cancelled"
                    className="text-white hover:bg-slate-600"
                  >
                    キャンセル
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注文テーブル（タブレット以上） */}
      <Card className="bg-slate-800 border-slate-700 hidden md:block">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-lg font-semibold">
            注文一覧 ({filteredOrders.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-750">
                  <TableHead className="text-slate-200 font-semibold px-4 lg:px-6 py-3 lg:py-4 text-sm">
                    注文ID
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    顧客情報
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    注文日
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    商品数
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    合計金額
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    注文ステータス
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    支払いステータス
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-sm">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-slate-700 hover:bg-slate-750 transition-colors duration-150"
                  >
                    <TableCell className="px-4 lg:px-6 py-3 lg:py-4">
                      <div>
                        <p className="font-medium text-white text-sm">
                          {order.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {order.customer}
                        </p>
                        <p className="text-xs text-slate-400">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-200 text-sm">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-slate-200 text-sm">
                      {order.items}点
                    </TableCell>
                    <TableCell className="text-white font-semibold text-sm">
                      ¥{order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select>
                          <SelectTrigger className="w-24 lg:w-32 h-8 bg-slate-700 border-slate-600 text-white focus:border-emerald-500 focus:ring-emerald-500 text-xs">
                            <SelectValue placeholder="変更" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem
                              value="pending"
                              className="text-white hover:bg-slate-600"
                            >
                              処理待ち
                            </SelectItem>
                            <SelectItem
                              value="processing"
                              className="text-white hover:bg-slate-600"
                            >
                              処理中
                            </SelectItem>
                            <SelectItem
                              value="shipped"
                              className="text-white hover:bg-slate-600"
                            >
                              配送中
                            </SelectItem>
                            <SelectItem
                              value="delivered"
                              className="text-white hover:bg-slate-600"
                            >
                              配送済み
                            </SelectItem>
                            <SelectItem
                              value="cancelled"
                              className="text-white hover:bg-slate-600"
                            >
                              キャンセル
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 結果が見つからない場合の表示 */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2 font-medium">
                注文が見つかりません
              </p>
              <p className="text-slate-400 text-sm">
                検索条件を変更してください
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 注文カード（モバイル） */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            注文一覧 ({filteredOrders.length}件)
          </h2>
        </div>

        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200"
          >
            <CardContent className="p-4">
              {/* ヘッダー部分 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate text-sm">
                    {order.id}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {order.customer}
                  </p>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 ml-2 flex-shrink-0 h-8 w-8 p-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* 詳細情報 */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-400">商品数</p>
                  <p className="font-medium text-slate-200 text-sm">
                    {order.items}点
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">合計金額</p>
                  <p className="font-semibold text-white text-sm">
                    ¥{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ステータス */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-colors duration-200 h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              {/* 配送先 */}
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-1">配送先</p>
                <p className="text-xs text-slate-300 truncate">
                  {order.shippingAddress}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* モバイル版：結果が見つからない場合の表示 */}
        {filteredOrders.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2 font-medium">
                注文が見つかりません
              </p>
              <p className="text-slate-400 text-sm">
                検索条件を変更してください
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
