// app/api/dashboard/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Next-Authの設定をインポート
import { getDashboardData } from "@/types/db-utils";

export async function GET(request: NextRequest) {
  try {
    // セッション認証チェック
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 401 }
      );
    }

    // URLパラメータから年度を取得
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // 年度が有効な範囲内かチェック（2020年〜現在年度）
    const currentYear = new Date().getFullYear();

    if (targetYear < 2020 || targetYear > currentYear) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid year parameter - only 2020-${currentYear} are allowed`,
        },
        { status: 400 }
      );
    }

    const dashboardData = await getDashboardData(targetYear);

    return NextResponse.json({
      success: true,
      data: dashboardData,
      year: targetYear,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"; // リアルタイム更新のため
