/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: カテゴリ一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    // 検索条件の構築
    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
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
    const { name, description, imageUrl, sortOrder } = body;

    // バリデーション
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "カテゴリ名は必須です",
        },
        { status: 400 }
      );
    }

    // 名前の重複チェック
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() },
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

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        sortOrder: sortOrder || 0,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "カテゴリが正常に作成されました",
    });
  } catch (error) {
    console.error("カテゴリ作成エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "カテゴリの作成に失敗しました",
      },
      { status: 500 }
    );
  }
}
