// app/admin/dashboard/products/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";

// 商品データの型定義
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: string;
  image: string;
}

// ダミーデータ
const products: Product[] = [
  {
    id: 1,
    name: "サマードレス",
    category: "衣類",
    price: 8900,
    stock: 85,
    sales: 120,
    status: "active",
    image: "/api/placeholder/60/60",
  },
  {
    id: 2,
    name: "デニムジャケット",
    category: "衣類",
    price: 12800,
    stock: 42,
    sales: 95,
    status: "active",
    image: "/api/placeholder/60/60",
  },
  {
    id: 3,
    name: "コットンTシャツ",
    category: "衣類",
    price: 3200,
    stock: 156,
    sales: 180,
    status: "active",
    image: "/api/placeholder/60/60",
  },
  {
    id: 4,
    name: "スポーツスニーカー",
    category: "靴",
    price: 15600,
    stock: 23,
    sales: 75,
    status: "low_stock",
    image: "/api/placeholder/60/60",
  },
  {
    id: 5,
    name: "ワイヤレスイヤホン",
    category: "電化製品",
    price: 9800,
    stock: 67,
    sales: 89,
    status: "active",
    image: "/api/placeholder/60/60",
  },
  {
    id: 6,
    name: "レザーハンドバッグ",
    category: "アクセサリー",
    price: 24800,
    stock: 0,
    sales: 45,
    status: "out_of_stock",
    image: "/api/placeholder/60/60",
  },
];

const getStatusBadge = (status: string, stock: number) => {
  if (status === "out_of_stock" || stock === 0) {
    return (
      <Badge className="bg-red-500 text-white font-medium">在庫切れ</Badge>
    );
  }
  if (status === "low_stock" || stock < 30) {
    return (
      <Badge className="bg-yellow-500 text-white font-medium">在庫少</Badge>
    );
  }
  return (
    <Badge className="bg-green-500 text-white font-medium">在庫あり</Badge>
  );
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => p.stock < 30).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-900 min-h-screen">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            商品管理
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            商品の追加、編集、在庫管理を行えます
          </p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          新しい商品を追加
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  総商品数
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
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  販売中
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  在庫少
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.lowStock}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  在庫切れ
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.outOfStock}
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
                placeholder="商品名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-white focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="カテゴリで絞り込み" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-slate-600"
                >
                  すべてのカテゴリ
                </SelectItem>
                <SelectItem
                  value="衣類"
                  className="text-white hover:bg-slate-600"
                >
                  衣類
                </SelectItem>
                <SelectItem
                  value="靴"
                  className="text-white hover:bg-slate-600"
                >
                  靴
                </SelectItem>
                <SelectItem
                  value="電化製品"
                  className="text-white hover:bg-slate-600"
                >
                  電化製品
                </SelectItem>
                <SelectItem
                  value="アクセサリー"
                  className="text-white hover:bg-slate-600"
                >
                  アクセサリー
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 商品テーブル（デスクトップ） */}
      <Card className="bg-slate-800 border-slate-700 hidden md:block">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">
            商品一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-750">
                  <TableHead className="text-slate-200 font-semibold px-6 py-4">
                    商品
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    カテゴリ
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    価格
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    在庫
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    売上数
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    ステータス
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-slate-700 hover:bg-slate-750 transition-colors duration-150"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-200 font-medium">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      ¥{product.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {product.sales}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status, product.stock)}
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
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 結果が見つからない場合の表示 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2 font-medium">
                商品が見つかりません
              </p>
              <p className="text-slate-400 text-sm">
                検索条件を変更するか、新しい商品を追加してください
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 商品カード（モバイル） */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {product.category} • ID: {product.id}
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

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-400">価格</p>
                      <p className="font-semibold text-white">
                        ¥{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">在庫</p>
                      <p className="font-medium text-slate-200">
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {getStatusBadge(product.status, product.stock)}
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
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* モバイル版：結果が見つからない場合の表示 */}
        {filteredProducts.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2 font-medium">
                商品が見つかりません
              </p>
              <p className="text-slate-400 text-sm">
                検索条件を変更するか、新しい商品を追加してください
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
