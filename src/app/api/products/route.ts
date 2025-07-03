// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 商品作成用の型定義
interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  categoryId: string;
  imageUrl?: string;
  images: string[];
  isActive: boolean;
}

// バリデーション関数
function validateProductData(
  data: CreateProductRequest
): data is CreateProductRequest {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.push("商品名は必須です");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    errors.push("商品説明は必須です");
  }

  if (typeof data.price !== "number" || data.price <= 0) {
    errors.push("販売価格は0より大きい値を入力してください");
  }

  if (
    data.costPrice !== undefined &&
    (typeof data.costPrice !== "number" || data.costPrice < 0)
  ) {
    errors.push("仕入価格は0以上の値を入力してください");
  }

  if (typeof data.stock !== "number" || data.stock < 0) {
    errors.push("在庫数は0以上の値を入力してください");
  }

  if (
    typeof data.lowStockThreshold !== "number" ||
    data.lowStockThreshold < 0
  ) {
    errors.push("低在庫閾値は0以上の値を入力してください");
  }

  if (!data.categoryId || typeof data.categoryId !== "string") {
    errors.push("カテゴリは必須です");
  }

  if (data.sku && (typeof data.sku !== "string" || data.sku.length < 3)) {
    errors.push("SKUは3文字以上で入力してください");
  }

  if (!Array.isArray(data.images)) {
    errors.push("画像データが不正です");
  }

  if (typeof data.isActive !== "boolean") {
    errors.push("公開設定が不正です");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return true;
}

// GET: 商品一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    // 検索条件の構築
    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    // 商品一覧とトータル数を並列取得
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("商品一覧取得エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "商品一覧の取得に失敗しました",
      },
      { status: 500 }
    );
  }
}

// POST: 商品作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    validateProductData(body);

    // カテゴリの存在確認
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "指定されたカテゴリが存在しません",
        },
        { status: 400 }
      );
    }

    // SKUの重複チェック（SKUが指定されている場合）
    if (body.sku) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: body.sku },
      });

      if (existingProduct) {
        return NextResponse.json(
          {
            success: false,
            error: "指定されたSKUは既に使用されています",
          },
          { status: 400 }
        );
      }
    }

    // 商品作成
    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
        price: new Prisma.Decimal(body.price),
        costPrice: body.costPrice ? new Prisma.Decimal(body.costPrice) : null,
        sku: body.sku || null,
        stock: body.stock,
        lowStockThreshold: body.lowStockThreshold,
        categoryId: body.categoryId,
        imageUrl: body.imageUrl || null,
        images: body.images,
        isActive: body.isActive,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 在庫履歴の作成（初期在庫として記録）
    if (body.stock > 0) {
      await prisma.stockHistory.create({
        data: {
          productId: product.id,
          type: "PURCHASE" as const,
          quantity: body.stock,
          reason: "初期在庫登録",
          beforeStock: 0,
          afterStock: body.stock,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "商品が正常に作成されました",
    });
  } catch (error) {
    console.error("商品作成エラー:", error);

    // Prismaエラーハンドリング
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "SKUが重複しています",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "商品の作成に失敗しました",
      },
      { status: 500 }
    );
  }
}

// PUT: 商品更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "商品IDが必要です",
        },
        { status: 400 }
      );
    }

    // 既存商品の確認
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "指定された商品が見つかりません",
        },
        { status: 404 }
      );
    }

    // バリデーション
    validateProductData(updateData);

    // SKUの重複チェック（変更された場合）
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const duplicateProduct = await prisma.product.findUnique({
        where: { sku: updateData.sku },
      });

      if (duplicateProduct) {
        return NextResponse.json(
          {
            success: false,
            error: "指定されたSKUは既に使用されています",
          },
          { status: 400 }
        );
      }
    }

    // 在庫変更の履歴記録
    const stockDifference = updateData.stock - existingProduct.stock;
    let stockHistoryData = null;

    if (stockDifference !== 0) {
      stockHistoryData = {
        productId: id,
        type:
          stockDifference > 0 ? ("PURCHASE" as const) : ("ADJUSTMENT" as const),
        quantity: Math.abs(stockDifference),
        reason: stockDifference > 0 ? "在庫追加" : "在庫調整",
        beforeStock: existingProduct.stock,
        afterStock: updateData.stock,
      };
    }

    // トランザクションで商品更新と在庫履歴作成を実行
    const result = await prisma.$transaction(async (tx) => {
      // 商品更新
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: updateData.name.trim(),
          description: updateData.description.trim(),
          price: new Prisma.Decimal(updateData.price),
          costPrice: updateData.costPrice
            ? new Prisma.Decimal(updateData.costPrice)
            : null,
          sku: updateData.sku || null,
          stock: updateData.stock,
          lowStockThreshold: updateData.lowStockThreshold,
          categoryId: updateData.categoryId,
          imageUrl: updateData.imageUrl || null,
          images: updateData.images,
          isActive: updateData.isActive,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 在庫履歴の記録
      if (stockHistoryData) {
        await tx.stockHistory.create({
          data: stockHistoryData,
        });
      }

      return updatedProduct;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "商品が正常に更新されました",
    });
  } catch (error) {
    console.error("商品更新エラー:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "SKUが重複しています",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "商品の更新に失敗しました",
      },
      { status: 500 }
    );
  }
}

// DELETE: 商品削除（論理削除）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "商品IDが必要です",
        },
        { status: 400 }
      );
    }

    // 既存商品の確認
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "指定された商品が見つかりません",
        },
        { status: 404 }
      );
    }

    // 注文に含まれている商品かチェック
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // 注文履歴がある場合は論理削除（非アクティブ化）
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { isActive: false },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedProduct,
        message:
          "商品を非アクティブ化しました（注文履歴があるため物理削除はできません）",
      });
    } else {
      // 注文履歴がない場合は物理削除
      await prisma.product.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "商品が正常に削除されました",
      });
    }
  } catch (error) {
    console.error("商品削除エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "商品の削除に失敗しました",
      },
      { status: 500 }
    );
  }
}
