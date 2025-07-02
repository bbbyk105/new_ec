// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// カテゴリ作成用の型定義
interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
}

// バリデーション関数
function validateCategoryData(
  data: CreateCategoryRequest
): data is CreateCategoryRequest {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.push("カテゴリ名は必須です");
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    errors.push("説明は文字列で入力してください");
  }

  if (data.imageUrl !== undefined && typeof data.imageUrl !== "string") {
    errors.push("画像URLは文字列で入力してください");
  }

  if (typeof data.isActive !== "boolean") {
    errors.push("公開設定が不正です");
  }

  if (
    data.sortOrder !== undefined &&
    (typeof data.sortOrder !== "number" || data.sortOrder < 0)
  ) {
    errors.push("並び順は0以上の数値で入力してください");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return true;
}

// GET: カテゴリ一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const includeProductCount =
      searchParams.get("includeProductCount") === "true";

    // 検索条件の構築
    const where: Prisma.CategoryWhereInput = {};

    if (activeOnly) {
      where.isActive = true;
    }

    // カテゴリ取得
    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: includeProductCount
          ? {
              select: {
                products: {
                  where: {
                    isActive: true, // アクティブな商品のみカウント
                  },
                },
              },
            }
          : false,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    // レスポンスデータの整形
    const formattedCategories = categories.map((category) => ({
      ...category,
      productCount: includeProductCount ? category._count?.products : undefined,
      _count: undefined, // _countフィールドを除外
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error("カテゴリ一覧取得エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "カテゴリ一覧の取得に失敗しました",
      },
      { status: 500 }
    );
  }
}

// POST: カテゴリ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    validateCategoryData(body);

    // カテゴリ名の重複チェック
    const existingCategory = await prisma.category.findUnique({
      where: { name: body.name.trim() },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "指定されたカテゴリ名は既に使用されています",
        },
        { status: 400 }
      );
    }

    // ソート順の設定（未指定の場合は最後に追加）
    let sortOrder = body.sortOrder;
    if (sortOrder === undefined) {
      const lastCategory = await prisma.category.findFirst({
        orderBy: { sortOrder: "desc" },
      });
      sortOrder = (lastCategory?.sortOrder || 0) + 1;
    }

    // カテゴリ作成
    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        imageUrl: body.imageUrl || null,
        isActive: body.isActive,
        sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "カテゴリが正常に作成されました",
    });
  } catch (error) {
    console.error("カテゴリ作成エラー:", error);

    // Prismaエラーハンドリング
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "カテゴリ名が重複しています",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "カテゴリの作成に失敗しました",
      },
      { status: 500 }
    );
  }
}

// PUT: カテゴリ更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "カテゴリIDが必要です",
        },
        { status: 400 }
      );
    }

    // 既存カテゴリの確認
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "指定されたカテゴリが見つかりません",
        },
        { status: 404 }
      );
    }

    // バリデーション
    validateCategoryData(updateData);

    // カテゴリ名の重複チェック（変更された場合）
    if (updateData.name.trim() !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findUnique({
        where: { name: updateData.name.trim() },
      });

      if (duplicateCategory) {
        return NextResponse.json(
          {
            success: false,
            error: "指定されたカテゴリ名は既に使用されています",
          },
          { status: 400 }
        );
      }
    }

    // カテゴリ更新
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: updateData.name.trim(),
        description: updateData.description?.trim() || null,
        imageUrl: updateData.imageUrl || null,
        isActive: updateData.isActive,
        sortOrder: updateData.sortOrder ?? existingCategory.sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: "カテゴリが正常に更新されました",
    });
  } catch (error) {
    console.error("カテゴリ更新エラー:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "カテゴリ名が重複しています",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "カテゴリの更新に失敗しました",
      },
      { status: 500 }
    );
  }
}

// DELETE: カテゴリ削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "カテゴリIDが必要です",
        },
        { status: 400 }
      );
    }

    // 既存カテゴリの確認
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "指定されたカテゴリが見つかりません",
        },
        { status: 404 }
      );
    }

    // カテゴリに紐づく商品が存在するかチェック
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "このカテゴリには商品が紐づいているため削除できません。先に商品を他のカテゴリに移動するか削除してください。",
        },
        { status: 400 }
      );
    }

    // カテゴリ削除
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "カテゴリが正常に削除されました",
    });
  } catch (error) {
    console.error("カテゴリ削除エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "カテゴリの削除に失敗しました",
      },
      { status: 500 }
    );
  }
}
