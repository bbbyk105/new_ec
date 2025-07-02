import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/types/db-utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");

    // 現在年度をデフォルトにする
    const currentYear = new Date().getFullYear();
    const year = yearParam ? parseInt(yearParam) : currentYear;

    // 年度の妥当性をチェック
    if (isNaN(year) || year < 2020 || year > currentYear) {
      return NextResponse.json(
        {
          success: false,
          error: "無効な年度が指定されました",
        },
        { status: 400 }
      );
    }

    const data = await getDashboardData(year);

    return NextResponse.json({
      success: true,
      data,
      message: "ダッシュボードデータを取得しました",
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "データベースエラーが発生しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POSTメソッドでデータ更新（必要に応じて）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "refresh") {
      // 手動更新の場合、現在年度のデータを取得
      const currentYear = new Date().getFullYear();
      const data = await getDashboardData(currentYear);

      return NextResponse.json({
        success: true,
        data,
        message: "データを更新しました",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "不正なアクションです",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Dashboard POST API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "データ更新に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
