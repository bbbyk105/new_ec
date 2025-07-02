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
import {
  ArrowLeft,
  ImagePlus,
  X,
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

  // 画像アップロード処理（仮実装）
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (formData.images.length === 0 && !formData.imageUrl) {
          handleInputChange("imageUrl", imageUrl);
        }
        handleInputChange("images", [...formData.images, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
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
                  魅力的な商品をストアに追加しましょう
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
          <Card className="mb-6 bg-red-500/10 border-red-500/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{errors.submit}</span>
              </div>
            </CardContent>
          </Card>
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
                      placeholder="例: プレミアム Tシャツ"
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
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
                      placeholder="商品の魅力的な説明を入力してください..."
                      rows={4}
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
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
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.categoryId}
                      </p>
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
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.price}
                        </p>
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
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.costPrice}
                        </p>
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
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.stock}
                        </p>
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
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.lowStockThreshold}
                        </p>
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
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.sku}
                      </p>
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
                  <CardTitle className="text-white flex items-center text-xl">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg mr-3">
                      <Camera className="w-5 h-5 text-purple-400" />
                    </div>
                    商品画像
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* メイン画像 */}
                  {formData.imageUrl && (
                    <div className="relative group">
                      <Image
                        src={formData.imageUrl}
                        alt="メイン画像"
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleInputChange("imageUrl", "")}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                    </div>
                  )}

                  {/* 画像アップロードエリア */}
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
                          画像をドラッグ&ドロップ
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
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </div>

                  {/* 追加画像一覧 */}
                  {formData.images.length > 1 && (
                    <div className="space-y-3">
                      <h4 className="text-slate-300 font-medium text-sm">
                        追加画像
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {formData.images.slice(1).map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image}
                              alt={`追加画像 ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newImages = formData.images.filter(
                                  (_, i) => i !== index + 1
                                );
                                handleInputChange("images", newImages);
                              }}
                              className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
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
                            画像を追加してください
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 追加画像のサムネイル */}
                    {formData.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {formData.images.slice(1, 5).map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={image}
                              alt={`サムネイル ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-20 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                            />
                          </div>
                        ))}
                        {formData.images.length > 5 && (
                          <div className="w-full h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-slate-500 text-sm font-medium">
                              +{formData.images.length - 5}
                            </span>
                          </div>
                        )}
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
                        <div className="flex items-center space-x-2 p-3 bg-orange-100 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          <span className="text-orange-700 text-sm font-medium">
                            残りわずか！急いでご注文ください
                          </span>
                        </div>
                      )}

                    {formData.stock === 0 && (
                      <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700 text-sm font-medium">
                          申し訳ございません。この商品は現在品切れです
                        </span>
                      </div>
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
