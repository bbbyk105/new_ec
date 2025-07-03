/* eslint-disable react-hooks/exhaustive-deps */
// app/admin/dashboard/products/page.tsx
"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// 型定義
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  imageUrl?: string;
  images: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  costPrice?: string;
  sku?: string;
  stock: string;
  lowStockThreshold: string;
  categoryId: string;
  imageUrl?: string;
  images: string[];
  isActive: boolean;
}

// 在庫状況バッジを取得する関数
const getStockStatusBadge = (product: Product) => {
  if (product.stock === 0) {
    return (
      <Badge className="bg-red-500 text-white font-medium">在庫切れ</Badge>
    );
  }
  if (product.stock <= product.lowStockThreshold) {
    return (
      <Badge className="bg-yellow-500 text-white font-medium">在庫少</Badge>
    );
  }
  return (
    <Badge className="bg-green-500 text-white font-medium">在庫あり</Badge>
  );
};

// 公開状態バッジを取得する関数
const getPublishStatusBadge = (product: Product) => {
  if (product.isActive) {
    return (
      <Badge className="bg-emerald-500 text-white font-medium">公開中</Badge>
    );
  }
  return <Badge className="bg-gray-500 text-white font-medium">非公開</Badge>;
};

const getStatusBadge = (product: Product) => {
  if (!product.isActive) {
    return <Badge className="bg-gray-500 text-white font-medium">非公開</Badge>;
  }
  if (product.stock === 0) {
    return (
      <Badge className="bg-red-500 text-white font-medium">在庫切れ</Badge>
    );
  }
  if (product.stock <= product.lowStockThreshold) {
    return (
      <Badge className="bg-yellow-500 text-white font-medium">在庫少</Badge>
    );
  }
  return <Badge className="bg-green-500 text-white font-medium">公開中</Badge>;
};

export default function ProductsPage() {
  const { toast } = useToast();

  // State管理
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // モーダル状態
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // フォーム状態
  const [editForm, setEditForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "0",
    costPrice: "",
    sku: "",
    stock: "0",
    lowStockThreshold: "10",
    categoryId: "",
    imageUrl: "",
    images: [],
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  // データ取得
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ProductResponse = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setCurrentPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.totalPages);
        setTotalCount(data.data.pagination.total);
      } else {
        toast({
          title: "エラー",
          description: data.error || "商品データの取得に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("商品取得エラー:", error);
      toast({
        title: "エラー",
        description: "商品データの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // カテゴリ取得
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("カテゴリ取得エラー:", error);
    }
  };

  // 商品更新
  const updateProduct = async () => {
    if (!selectedProduct) return;

    try {
      setFormLoading(true);

      // フォームデータを数値に変換
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        costPrice:
          editForm.costPrice && editForm.costPrice !== ""
            ? Number(editForm.costPrice)
            : null,
        sku: editForm.sku,
        stock: Number(editForm.stock),
        lowStockThreshold: Number(editForm.lowStockThreshold),
        categoryId: editForm.categoryId,
        imageUrl: editForm.imageUrl,
        images: editForm.images,
        isActive: editForm.isActive,
      };

      const response = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedProduct.id,
          ...updateData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "成功",
          description: "商品を更新しました",
          variant: "success",
        });
        setEditModalOpen(false);
        fetchProducts(currentPage);
      } else {
        toast({
          title: "エラー",
          description: data.error || "商品の更新に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("商品更新エラー:", error);
      toast({
        title: "エラー",
        description: "商品の更新に失敗しました",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // 商品削除
  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products?id=${selectedProduct.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "成功",
          description: data.message || "商品を削除しました",
          variant: "success",
        });
        setDeleteAlertOpen(false);
        fetchProducts(currentPage);
      } else {
        toast({
          title: "エラー",
          description: data.error || "商品の削除に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("商品削除エラー:", error);
      toast({
        title: "エラー",
        description: "商品の削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  // モーダル操作
  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      costPrice: product.costPrice ? product.costPrice.toString() : "",
      sku: product.sku || "",
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || "",
      images: product.images,
      isActive: product.isActive,
    });
    setEditModalOpen(true);
  };

  const openDeleteAlert = (product: Product) => {
    setSelectedProduct(product);
    setDeleteAlertOpen(true);
  };

  // 統計計算
  const stats = {
    total: totalCount,
    published: products.filter((p) => p.isActive).length,
    draft: products.filter((p) => !p.isActive).length,
    lowStock: products.filter(
      (p) => p.stock <= p.lowStockThreshold && p.stock > 0
    ).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  // 初期データ取得
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // 検索・フィルター変更時
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter]);

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
        <Link href="/admin/dashboard/add-products">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            新しい商品を追加
          </Button>
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  公開中
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.published}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  非公開
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.draft}
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
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="text-white hover:bg-slate-600"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ローディング状態 */}
      {loading ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-slate-300">商品データを読み込んでいます...</p>
          </CardContent>
        </Card>
      ) : (
        <>
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
                        在庫数
                      </TableHead>
                      <TableHead className="text-slate-200 font-semibold">
                        在庫状況
                      </TableHead>
                      <TableHead className="text-slate-200 font-semibold">
                        商品コード
                      </TableHead>
                      <TableHead className="text-slate-200 font-semibold">
                        公開状態
                      </TableHead>
                      <TableHead className="text-slate-200 font-semibold">
                        操作
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-slate-700 hover:bg-slate-750 transition-colors duration-150"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {product.imageUrl && (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-white">
                                {product.name}
                              </p>
                              <p className="text-sm text-slate-400 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-200 font-medium">
                          {product.category.name}
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          ¥{product.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-200 font-medium">
                          {product.stock}
                        </TableCell>
                        <TableCell>{getStockStatusBadge(product)}</TableCell>
                        <TableCell className="text-slate-200">
                          {product.sku || "-"}
                        </TableCell>
                        <TableCell>{getPublishStatusBadge(product)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openViewModal(product)}
                              className="hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(product)}
                              className="hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDeleteAlert(product)}
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
              {products.length === 0 && (
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
            {products.map((product) => (
              <Card
                key={product.id}
                className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {product.category.name} • {product.sku || "SKUなし"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openViewModal(product)}
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
                          <p className="text-xs text-slate-400">在庫数</p>
                          <p className="font-medium text-slate-200">
                            {product.stock}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getStockStatusBadge(product)}
                          {getPublishStatusBadge(product)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(product)}
                            className="border-slate-600 text-slate-300 hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDeleteAlert(product)}
                            className="border-slate-600 text-slate-300 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* モバイル版：結果が見つからない場合の表示 */}
            {products.length === 0 && (
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

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => fetchProducts(currentPage - 1)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                前へ
              </Button>
              <span className="flex items-center px-4 text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => fetchProducts(currentPage + 1)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                次へ
              </Button>
            </div>
          )}
        </>
      )}

      {/* 詳細表示モーダル */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">商品詳細</DialogTitle>
            <DialogDescription className="text-slate-400">
              商品の詳細情報を表示しています
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {selectedProduct.imageUrl && (
                <div className="flex justify-center">
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">商品名</Label>
                  <p className="text-white font-medium">
                    {selectedProduct.name}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-300">カテゴリ</Label>
                  <p className="text-white">{selectedProduct.category.name}</p>
                </div>
                <div>
                  <Label className="text-slate-300">価格</Label>
                  <p className="text-white font-bold">
                    ¥{selectedProduct.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-300">仕入価格</Label>
                  <p className="text-white">
                    {selectedProduct.costPrice
                      ? `¥${selectedProduct.costPrice.toLocaleString()}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-300">在庫数</Label>
                  <p className="text-white">{selectedProduct.stock}</p>
                </div>
                <div>
                  <Label className="text-slate-300">SKU</Label>
                  <p className="text-white">{selectedProduct.sku || "-"}</p>
                </div>
              </div>
              <div>
                <Label className="text-slate-300">商品説明</Label>
                <p className="text-white mt-1">{selectedProduct.description}</p>
              </div>
              <div>
                <Label className="text-slate-300">ステータス</Label>
                <div className="mt-1">{getStatusBadge(selectedProduct)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 編集モーダル */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">商品編集</DialogTitle>
            <DialogDescription className="text-slate-400">
              商品情報を編集できます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">商品名 *</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="商品名を入力"
                />
              </div>
              <div>
                <Label className="text-slate-300">カテゴリ *</Label>
                <Select
                  value={editForm.categoryId}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, categoryId: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-white hover:bg-slate-600"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">商品説明 *</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="商品説明を入力"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">販売価格 *</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label className="text-slate-300">仕入価格</Label>
                <Input
                  type="number"
                  value={editForm.costPrice}
                  onChange={(e) =>
                    setEditForm({ ...editForm, costPrice: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">在庫数 *</Label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label className="text-slate-300">低在庫閾値</Label>
                <Input
                  type="number"
                  value={editForm.lowStockThreshold}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      lowStockThreshold: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="10"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">SKU</Label>
                <Input
                  value={editForm.sku}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sku: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="SKUコードを入力"
                />
              </div>
              <div>
                <Label className="text-slate-300">画像URL</Label>
                <Input
                  value={editForm.imageUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, imageUrl: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="画像URLを入力"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editForm.isActive}
                onChange={(e) =>
                  setEditForm({ ...editForm, isActive: e.target.checked })
                }
                className="rounded border-slate-600 bg-slate-700"
              />
              <Label htmlFor="isActive" className="text-slate-300">
                商品を公開する
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              キャンセル
            </Button>
            <Button
              onClick={updateProduct}
              disabled={formLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  更新中...
                </>
              ) : (
                "更新"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認アラート */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-400">
              商品を削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {selectedProduct && (
                <>
                  「{selectedProduct.name}」を削除します。
                  {selectedProduct.stock > 0 && (
                    <span className="block mt-2 text-yellow-400">
                      ⚠️ この商品にはまだ在庫があります。
                    </span>
                  )}
                  この操作は取り消せません。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteProduct}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
