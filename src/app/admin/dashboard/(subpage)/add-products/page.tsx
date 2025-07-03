"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  Eye,
  AlertCircle,
  Package,
  DollarSign,
  Hash,
  Tag,
  FileText,
  Camera,
  Sparkles,
  Zap,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 型定義
interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  categoryId: string;
  imageUrl: string;
  images: string[];
  isActive: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function AddProductPage() {
  const router = useRouter();

  // フォームデータの状態管理
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    costPrice: 0,
    sku: "",
    stock: 0,
    lowStockThreshold: 10,
    categoryId: "",
    imageUrl: "",
    images: [],
    isActive: true,
  });

  // その他の状態管理
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error("カテゴリの取得に失敗しました:", error);
      }
    };

    fetchCategories();
  }, []);

  // バリデーション関数
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "商品名は必須です";
    }

    if (!formData.description.trim()) {
      newErrors.description = "商品説明は必須です";
    }

    if (formData.price <= 0) {
      newErrors.price = "販売価格は0より大きい値を入力してください";
    }

    if (formData.costPrice && formData.costPrice < 0) {
      newErrors.costPrice = "仕入価格は0以上の値を入力してください";
    }

    if (formData.stock < 0) {
      newErrors.stock = "在庫数は0以上の値を入力してください";
    }

    if (formData.lowStockThreshold < 0) {
      newErrors.lowStockThreshold = "低在庫閾値は0以上の値を入力してください";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "カテゴリは必須です";
    }

    if (formData.sku && formData.sku.length < 3) {
      newErrors.sku = "SKUは3文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ファイル形式チェック関数
  const isWebPFile = (file: File): boolean => {
    return file.type === "image/webp";
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 成功時はダッシュボードにリダイレクト
        router.push("/admin/dashboard?success=product-added");
      } else {
        const error = await response.json();
        throw new Error(error.message || "商品の追加に失敗しました");
      }
    } catch (error) {
      console.error("商品追加エラー:", error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "予期しないエラーが発生しました",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 入力値変更処理
  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 画像アップロード処理（WebP制限付き・1枚のみ）
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    // 既に画像がある場合は警告
    if (formData.imageUrl) {
      setErrors((prev) => ({
        ...prev,
        image:
          "画像は1枚のみアップロード可能です。既存の画像を削除してから新しい画像をアップロードしてください。",
      }));
      return;
    }

    const webpFiles = Array.from(files).filter(isWebPFile);
    const nonWebpFiles = Array.from(files).filter((file) => !isWebPFile(file));

    // WebP以外のファイルがある場合はエラーを表示
    if (nonWebpFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        image: "WebP形式の画像ファイルのみアップロード可能です",
      }));
      return;
    }

    // 複数ファイルが選択された場合は最初の1枚のみを使用
    if (webpFiles.length > 1) {
      setErrors((prev) => ({
        ...prev,
        image:
          "画像は1枚のみアップロード可能です。最初の画像のみが使用されます。",
      }));
    }

    // 画像エラーをクリア（複数ファイル警告以外）
    if (errors.image && webpFiles.length <= 1) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }

    // 最初の1枚のみを処理
    if (webpFiles.length > 0) {
      const file = webpFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleInputChange("imageUrl", imageUrl);
        handleInputChange("images", [imageUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  // 画像削除処理（確認ダイアログ付き）
  const removeImage = () => {
    handleInputChange("imageUrl", "");
    handleInputChange("images", []);
    setShowDeleteDialog(false);
  };

  // 全ての画像を削除（確認ダイアログ付き）
  const removeAllImages = () => {
    handleInputChange("imageUrl", "");
    handleInputChange("images", []);
    setShowDeleteDialog(false);
  };

  // SKU自動生成
  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const categoryCode =
      categories
        .find((c) => c.id === formData.categoryId)
        ?.name.substring(0, 2)
        .toUpperCase() || "PR";
    const sku = `${categoryCode}${timestamp}`;
    handleInputChange("sku", sku);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <Link href="/admin/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-200 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ダッシュボードに戻る
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl backdrop-blur-sm border border-emerald-500/20">
                <Package className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  新商品追加
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                  商品をストアに追加しましょう
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 hover:border-blue-400 hover:text-blue-200 backdrop-blur-sm transition-all duration-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "編集モード" : "プレビュー"}
            </Button>
          </div>
        </div>

        {/* エラー表示 */}
        {errors.submit && (
          <Alert className="mb-6 border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* メインコンテンツ */}
            <div className="xl:col-span-2 space-y-8">
              {/* 基本情報 */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white flex items-center text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mr-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    基本情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 商品名 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-slate-300 font-medium"
                    >
                      商品名 <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="例:日本酒　獺祭"
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {formData.name && (
                      <Alert className="border-emerald-500/20 bg-emerald-500/10">
                        <AlertCircle className="h-4 w-4 text-emerald-400" />
                        <AlertDescription className="text-emerald-300 text-sm">
                          商品名「{formData.name}」で入力されています
                        </AlertDescription>
                      </Alert>
                    )}
                    {errors.name && (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300 text-sm">
                          {errors.name}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* 商品説明 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-slate-300 font-medium"
                    >
                      商品説明 <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="商品の説明を入力してください"
                      rows={4}
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    />
                    {errors.description && (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300 text-sm">
                          {errors.description}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* カテゴリ */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-slate-300 font-medium"
                    >
                      カテゴリ <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        handleInputChange("categoryId", value)
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500/50 transition-all duration-200">
                        <SelectValue placeholder="カテゴリを選択してください" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="text-white hover:bg-slate-700"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300 text-sm">
                          {errors.categoryId}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 価格・在庫情報 */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white flex items-center text-xl">
                    <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg mr-3">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    価格・在庫設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* 販売価格 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="text-slate-300 font-medium"
                      >
                        販売価格 (円) <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                          ¥
                        </span>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.price || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="bg-slate-700/50 border-slate-600/50 text-white pl-8 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-200"
                        />
                      </div>
                      {errors.price && (
                        <Alert className="border-red-500/20 bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-300 text-sm">
                            {errors.price}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* 仕入価格 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="costPrice"
                        className="text-slate-300 font-medium"
                      >
                        仕入価格 (円)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                          ¥
                        </span>
                        <Input
                          id="costPrice"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.costPrice || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "costPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="bg-slate-700/50 border-slate-600/50 text-white pl-8 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-200"
                        />
                      </div>
                      {errors.costPrice && (
                        <Alert className="border-red-500/20 bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-300 text-sm">
                            {errors.costPrice}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* 在庫数 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="stock"
                        className="text-slate-300 font-medium"
                      >
                        在庫数
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "stock",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        className="bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      {errors.stock && (
                        <Alert className="border-red-500/20 bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-300 text-sm">
                            {errors.stock}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* 低在庫閾値 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="lowStockThreshold"
                        className="text-slate-300 font-medium"
                      >
                        低在庫アラート
                      </Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "lowStockThreshold",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="10"
                        className="bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      {errors.lowStockThreshold && (
                        <Alert className="border-red-500/20 bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-300 text-sm">
                            {errors.lowStockThreshold}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-slate-300 font-medium">
                      SKU (商品管理番号)
                    </Label>
                    <div className="flex space-x-3">
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) =>
                          handleInputChange("sku", e.target.value)
                        }
                        placeholder="例: TS001"
                        className="bg-slate-700/50 border-slate-600/50 text-white flex-1 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      <Button
                        type="button"
                        className="bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 hover:border-blue-400 hover:text-blue-200 backdrop-blur-sm transition-all duration-200"
                        onClick={generateSKU}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        自動生成
                      </Button>
                    </div>
                    {errors.sku && (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300 text-sm">
                          {errors.sku}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* サイドバー */}
            <div className="space-y-8">
              {/* 商品画像 */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center text-xl">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg mr-3">
                        <Camera className="w-5 h-5 text-purple-400" />
                      </div>
                      商品画像
                    </CardTitle>
                    {formData.imageUrl && (
                      <AlertDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              写真を削除
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-300">
                              この操作は取り消せません。本当に写真を削除しますか？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                              キャンセル
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={removeAllImages}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              削除する
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* WebP形式に関する注意書き */}
                  <Alert className="border-blue-500/20 bg-blue-500/10">
                    <AlertDescription className="text-blue-200 text-sm">
                      <span className="font-medium text-blue-300 block mb-1">
                        画像アップロードについて
                      </span>
                      ・WebP形式の画像ファイルのみアップロード可能です
                      <br />
                      ・画像は1枚のみ登録できます
                    </AlertDescription>
                  </Alert>

                  {/* 画像エラー表示 */}
                  {errors.image && (
                    <Alert className="border-red-500/20 bg-red-500/10">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300 text-sm">
                        {errors.image}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* メイン画像 */}
                  {formData.imageUrl && (
                    <div className="relative group">
                      <Image
                        src={formData.imageUrl}
                        alt="商品画像"
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <AlertDialog>
                        <AlertDialogContent className="bg-slate-800 border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              写真を削除
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-300">
                              この操作は取り消せません。本当に写真を削除しますか？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                              キャンセル
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={removeImage}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              削除する
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                    </div>
                  )}

                  {/* 画像アップロードエリア */}
                  {!formData.imageUrl && (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragOver
                          ? "border-blue-400/50 bg-blue-400/10 scale-105"
                          : "border-slate-600/50 hover:border-slate-500/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl w-fit mx-auto">
                          <ImagePlus className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-slate-300 font-medium mb-1">
                            WebP画像をドラッグ&ドロップ
                          </p>
                          <p className="text-slate-400 text-sm mb-3">または</p>
                          <Button
                            type="button"
                            className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400 hover:text-emerald-200 transition-all duration-200"
                            size="sm"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            ファイルを選択
                          </Button>
                        </div>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept=".webp"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 公開設定 */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-white flex items-center text-xl">
                    <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg mr-3">
                      <Tag className="w-5 h-5 text-orange-400" />
                    </div>
                    公開設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleInputChange("isActive", checked)
                      }
                      className="border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div>
                      <Label
                        htmlFor="isActive"
                        className="text-slate-300 font-medium cursor-pointer"
                      >
                        この商品を公開する
                      </Label>
                      <p className="text-slate-500 text-sm">
                        チェックを外すと商品は非公開になります
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* アクションボタン */}
              <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          追加中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          商品を追加
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="w-full bg-slate-500/20 border border-slate-500/50 text-slate-300 hover:bg-slate-500/30 hover:border-slate-400 hover:text-slate-200 backdrop-blur-sm transition-all duration-200"
                      onClick={() => router.back()}
                    >
                      キャンセル
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* プレビューモード */}
        {previewMode && (
          <Card className="mt-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-white flex items-center text-xl">
                <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg mr-3">
                  <Eye className="w-5 h-5 text-indigo-400" />
                </div>
                商品プレビュー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-inner">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 商品画像 */}
                  <div className="space-y-4">
                    {formData.imageUrl ? (
                      <div className="relative">
                        <Image
                          src={formData.imageUrl}
                          alt={formData.name}
                          width={500}
                          height={500}
                          className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
                      </div>
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-inner">
                        <div className="text-center space-y-3">
                          <ImagePlus className="w-16 h-16 text-slate-400 mx-auto" />
                          <p className="text-slate-500 font-medium">
                            WebP画像を追加してください
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 追加画像のサムネイル */}
                    {formData.imageUrl && (
                      <div className="mt-4">
                        <div className="text-center p-4 bg-slate-100 rounded-lg">
                          <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                          <p className="text-slate-600 text-sm">
                            商品画像が設定されています
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {formData.isActive && (
                          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                            公開中
                          </span>
                        )}
                        {categories.find(
                          (c) => c.id === formData.categoryId
                        ) && (
                          <span className="px-3 py-1 bg-slate-500 text-white text-xs font-semibold rounded-full">
                            {
                              categories.find(
                                (c) => c.id === formData.categoryId
                              )?.name
                            }
                          </span>
                        )}
                      </div>

                      <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                        {formData.name || "商品名を入力してください"}
                      </h2>

                      <div className="flex items-baseline space-x-4">
                        <p className="text-4xl font-bold text-emerald-600">
                          ¥{formData.price.toLocaleString()}
                        </p>
                        {formData.costPrice > 0 && (
                          <p className="text-lg text-slate-500 line-through">
                            ¥{formData.costPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed">
                        {formData.description || "商品説明を入力してください"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-6 bg-slate-100 rounded-xl">
                      <div className="text-center">
                        <p className="text-sm text-slate-500 mb-1">在庫数</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {formData.stock}個
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-500 mb-1">SKU</p>
                        <p className="text-lg font-mono text-slate-700">
                          {formData.sku || "未設定"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                        <Package className="w-5 h-5 mr-2" />
                        カートに追加
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-3 rounded-xl"
                      >
                        <Star className="w-5 h-5 mr-2" />
                        お気に入りに追加
                      </Button>
                    </div>

                    {formData.stock <= formData.lowStockThreshold &&
                      formData.stock > 0 && (
                        <Alert className="border-orange-500/20 bg-orange-100">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <AlertDescription className="text-orange-700 text-sm font-medium">
                            残りわずか！急いでご注文ください
                          </AlertDescription>
                        </Alert>
                      )}

                    {formData.stock === 0 && (
                      <Alert className="border-red-500/20 bg-red-100">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-700 text-sm font-medium">
                          申し訳ございません。この商品は現在品切れです
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                {/* 商品詳細セクション */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    商品詳細
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">商品番号</p>
                      <p className="font-semibold text-slate-900">
                        {formData.sku || "未設定"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Tag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">カテゴリ</p>
                      <p className="font-semibold text-slate-900">
                        {categories.find((c) => c.id === formData.categoryId)
                          ?.name || "未選択"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Zap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">在庫状況</p>
                      <p className="font-semibold text-slate-900">
                        {formData.stock > 0 ? "在庫あり" : "品切れ"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">公開状態</p>
                      <p className="font-semibold text-slate-900">
                        {formData.isActive ? "公開中" : "非公開"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
