// app/admin/dashboard/products/page.tsx
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
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// ダミーデータ
const products = [
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
    return <Badge className="bg-red-500 text-white">在庫切れ</Badge>;
  }
  if (status === "low_stock" || stock < 30) {
    return <Badge className="bg-yellow-500 text-white">在庫少</Badge>;
  }
  return <Badge className="bg-green-500 text-white">在庫あり</Badge>;
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
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">商品管理</h1>
          <p className="text-slate-400">商品の追加、編集、在庫管理を行えます</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          新しい商品を追加
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">総商品数</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">販売中</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">在庫少</p>
                <p className="text-2xl font-bold text-white">
                  {stats.lowStock}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">在庫切れ</p>
                <p className="text-2xl font-bold text-white">
                  {stats.outOfStock}
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
                placeholder="商品名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                <SelectValue placeholder="カテゴリで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                <SelectItem value="衣類">衣類</SelectItem>
                <SelectItem value="靴">靴</SelectItem>
                <SelectItem value="電化製品">電化製品</SelectItem>
                <SelectItem value="アクセサリー">アクセサリー</SelectItem>
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

      {/* 商品テーブル */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">商品一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">商品</TableHead>
                <TableHead className="text-slate-300">カテゴリ</TableHead>
                <TableHead className="text-slate-300">価格</TableHead>
                <TableHead className="text-slate-300">在庫</TableHead>
                <TableHead className="text-slate-300">売上数</TableHead>
                <TableHead className="text-slate-300">ステータス</TableHead>
                <TableHead className="text-slate-300">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-slate-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-slate-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    ¥{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-slate-300">
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
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 結果が見つからない場合の表示 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">
                商品が見つかりません
              </p>
              <p className="text-slate-500 text-sm">
                検索条件を変更するか、新しい商品を追加してください
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
