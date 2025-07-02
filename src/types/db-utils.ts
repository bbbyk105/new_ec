/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/db-utils.ts
import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  type Order,
  type OrderItem,
  type Product,
  type Category,
} from "@prisma/client";

// 型定義
type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: Product & {
      category: Category;
    };
  })[];
};

type DailySalesQueryResult = {
  month: number;
  sales: number;
  orders: bigint;
};

type TopProductQueryResult = {
  product_id: string;
  name: string;
  total_quantity: bigint;
  total_sales: number;
};

// サービス開始年度の定数
const SERVICE_START_YEAR = 2025;

// 売上データ取得用の関数
export async function getDailySalesData(startDate: Date, endDate: Date) {
  return await prisma.dailySales.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

// カテゴリ別売上データ取得
export async function getCategorySalesData(startDate: Date, endDate: Date) {
  return await prisma.categorySales.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
    },
    orderBy: [{ date: "asc" }, { category: { name: "asc" } }],
  });
}

// 月次売上データ集計（年度指定版）
export async function getMonthlySalesData(year: number) {
  const monthlyData = await prisma.$queryRaw<DailySalesQueryResult[]>`
    SELECT 
      EXTRACT(MONTH FROM date) as month,
      SUM("totalSales") as sales,
      SUM("totalOrders") as orders
    FROM daily_sales 
    WHERE EXTRACT(YEAR FROM date) = ${year}
    GROUP BY EXTRACT(MONTH FROM date)
    ORDER BY month
  `;

  return monthlyData.map((item: DailySalesQueryResult) => ({
    month: `${item.month}月`,
    sales: Number(item.sales),
    orders: Number(item.orders),
  }));
}

// 指定年度のKPI取得（修正版）
export async function getYearlyKPIs(year: number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 当日の売上（今日の日付で検索）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySales = await prisma.dailySales.findUnique({
    where: {
      date: today,
    },
  });

  // 今月の累計売上（現在の年月のみ）
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const monthlyAggregate = await prisma.dailySales.aggregate({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      totalSales: true,
      totalOrders: true,
    },
  });

  // 指定年度の累計売上
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  const yearlyAggregate = await prisma.dailySales.aggregate({
    where: {
      date: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    _sum: {
      totalSales: true,
      totalOrders: true,
    },
  });

  // 全期間の累計売上
  const totalAggregate = await prisma.dailySales.aggregate({
    _sum: {
      totalSales: true,
      totalOrders: true,
    },
  });

  // 選択年度の平均注文単価を計算
  const yearlyTotalSales = Number(yearlyAggregate._sum.totalSales || 0);
  const yearlyTotalOrders = Number(yearlyAggregate._sum.totalOrders || 0);
  const avgOrderValue =
    yearlyTotalOrders > 0 ? yearlyTotalSales / yearlyTotalOrders : 0;

  // リピート率計算（複数回注文した顧客の割合）
  const totalCustomers = await prisma.customer.count();

  const repeatCustomers = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(DISTINCT customer_id) as count
    FROM (
      SELECT "customerId" as customer_id, COUNT(*) as order_count
      FROM orders
      WHERE status = 'DELIVERED'
      GROUP BY "customerId"
      HAVING COUNT(*) > 1
    ) repeat_customers
  `;

  const repeatRate =
    totalCustomers > 0
      ? Math.round(
          (Number(repeatCustomers[0]?.count || 0) / totalCustomers) * 100
        )
      : 0;

  return {
    todaySales: Number(todaySales?.totalSales || 0),
    monthlyTotal: Number(monthlyAggregate._sum.totalSales || 0),
    yearlyTotal: yearlyTotalSales,
    monthlyOrders: Number(monthlyAggregate._sum.totalOrders || 0),
    yearlyOrders: yearlyTotalOrders,
    avgOrderValue: avgOrderValue, // 選択年度の平均注文単価
    totalSales: Number(totalAggregate._sum.totalSales || 0),
    repeatRate,
  };
}

// 低在庫商品取得
export async function getLowStockProducts() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      stock: {
        lte: 10,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      stock: "asc",
    },
  });
}

// 売上ランキング取得（商品別）
export async function getTopSellingProducts(limit: number = 10) {
  const topProducts = await prisma.$queryRaw<TopProductQueryResult[]>`
    SELECT 
      p.id as product_id,
      p.name,
      SUM(oi.quantity) as total_quantity,
      SUM(oi.total) as total_sales
    FROM products p
    JOIN order_items oi ON p.id = oi."productId"
    JOIN orders o ON oi."orderId" = o.id
    WHERE o.status = 'DELIVERED'
    GROUP BY p.id, p.name
    ORDER BY total_sales DESC
    LIMIT ${limit}
  `;

  return topProducts.map((item: TopProductQueryResult) => ({
    productId: item.product_id,
    name: item.name,
    totalQuantity: Number(item.total_quantity),
    totalSales: Number(item.total_sales),
  }));
}

// 売上データ更新（日次バッチ処理用）
export async function updateDailySalesData(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // その日の配送完了注文を取得
  const orders = await prisma.order.findMany({
    where: {
      status: OrderStatus.DELIVERED,
      deliveredAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (orders.length === 0) return;

  const totalSales = orders.reduce(
    (sum: number, order: Order) => sum + Number(order.total),
    0
  );
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (sum: number, order: OrderWithItems) =>
      sum +
      order.orderItems.reduce(
        (itemSum: number, item: OrderItem) => itemSum + item.quantity,
        0
      ),
    0
  );

  // 日次売上データ更新
  await prisma.dailySales.upsert({
    where: { date: startOfDay },
    update: {
      totalSales,
      totalOrders,
      totalItems,
      avgOrderValue: totalSales / totalOrders,
    },
    create: {
      date: startOfDay,
      totalSales,
      totalOrders,
      totalItems,
      avgOrderValue: totalSales / totalOrders,
    },
  });

  // カテゴリ別売上データ更新
  const categorySales = new Map<
    string,
    {
      sales: number;
      orders: Set<string>;
      items: number;
    }
  >();

  orders.forEach((order: OrderWithItems) => {
    order.orderItems.forEach(
      (item: OrderItem & { product: Product & { category: Category } }) => {
        const categoryId = item.product.categoryId;
        if (!categorySales.has(categoryId)) {
          categorySales.set(categoryId, {
            sales: 0,
            orders: new Set(),
            items: 0,
          });
        }

        const catData = categorySales.get(categoryId)!;
        catData.sales += Number(item.total);
        catData.orders.add(order.id);
        catData.items += item.quantity;
      }
    );
  });

  for (const [categoryId, data] of categorySales) {
    await prisma.categorySales.upsert({
      where: {
        date_categoryId: {
          date: startOfDay,
          categoryId,
        },
      },
      update: {
        sales: data.sales,
        orders: data.orders.size,
        items: data.items,
      },
      create: {
        date: startOfDay,
        categoryId,
        sales: data.sales,
        orders: data.orders.size,
        items: data.items,
      },
    });
  }
}

// ダッシュボード用のデータ取得関数（修正版）
export async function getDashboardData(year?: number) {
  const currentYear = new Date().getFullYear();
  const targetYear = year || currentYear; // デフォルトは現在年度
  const startOfYear = new Date(targetYear, 0, 1);
  const endOfYear = new Date(targetYear, 11, 31);

  try {
    // 並列でデータを取得してパフォーマンスを向上
    const [monthlySales, categorySales, kpis, availableYears] =
      await Promise.all([
        getMonthlySalesData(targetYear),
        getCategorySalesData(startOfYear, endOfYear),
        getYearlyKPIs(targetYear),
        getAvailableYears(),
      ]);

    // カテゴリ別売上を集計
    const categoryTotals = new Map<string, number>();
    categorySales.forEach((sale: any) => {
      const categoryName = sale.category.name;
      const currentTotal = categoryTotals.get(categoryName) || 0;
      categoryTotals.set(categoryName, currentTotal + Number(sale.sales));
    });

    const categoryData = Array.from(categoryTotals.entries()).map(
      ([name, value]) => ({
        name,
        value: Math.round(value / 1000), // 千円単位に変換
        color: getCategoryColor(name),
      })
    );

    // 月次売上データにダミーデータを補完（データが不足している場合）
    const completeMonthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const existingData = monthlySales.find(
        (item) => item.month === `${month}月`
      );
      if (existingData) {
        completeMonthlyData.push(existingData);
      } else {
        // データがない月は0で補完
        completeMonthlyData.push({
          month: `${month}月`,
          sales: 0,
          orders: 0,
        });
      }
    }

    return {
      monthlySales: completeMonthlyData,
      categoryData,
      kpis,
      availableYears,
      selectedYear: targetYear,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// カテゴリカラーマッピング
function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    衣類: "#10B981",
    食品: "#F59E0B",
    電化製品: "#8B5CF6",
    その他: "#06B6D4",
  };
  return colorMap[categoryName] || "#6B7280";
}

// 年度別データの存在確認（修正版）
export async function getAvailableYears(): Promise<number[]> {
  try {
    const currentYear = new Date().getFullYear();

    // データベースから実際にデータが存在する年度を取得
    const yearsWithData = await prisma.$queryRaw<{ year: number }[]>`
      SELECT DISTINCT EXTRACT(YEAR FROM date) as year
      FROM daily_sales
      ORDER BY year DESC
    `;

    const dbYears = yearsWithData.map((row) => Number(row.year));

    // 年度リストを作成
    const availableYears = new Set<number>();

    // 1. データベースにある年度を追加（サービス開始年度以前の参考データ）
    dbYears.forEach((year) => {
      if (year < SERVICE_START_YEAR && year >= 2020) {
        // 2020年以降の参考データのみ表示
        availableYears.add(year);
      } else if (year >= SERVICE_START_YEAR && year <= currentYear) {
        // サービス開始年度以降で現在年度まで
        availableYears.add(year);
      }
    });

    // 2. サービス開始年度から現在年度までを追加（データがなくても表示）
    for (let year = SERVICE_START_YEAR; year <= currentYear; year++) {
      availableYears.add(year);
    }

    return Array.from(availableYears).sort((a, b) => b - a); // 降順でソート
  } catch (error) {
    console.error("Error getting available years:", error);
    // エラーの場合は現在年度とサービス開始年度を返す
    const currentYear = new Date().getFullYear();
    const years = [];

    // サービス開始年度から現在年度まで
    for (let i = currentYear; i >= SERVICE_START_YEAR; i--) {
      years.push(i);
    }

    return years;
  }
}

// 売上レポート用のデータ取得
export async function getSalesReport(startDate: Date, endDate: Date) {
  const dailySales = await getDailySalesData(startDate, endDate);
  const categorySales = await getCategorySalesData(startDate, endDate);
  const topProducts = await getTopSellingProducts(10);

  return {
    dailySales,
    categorySales,
    topProducts,
    summary: {
      totalSales: dailySales.reduce(
        (sum, day) => sum + Number(day.totalSales),
        0
      ),
      totalOrders: dailySales.reduce((sum, day) => sum + day.totalOrders, 0),
      averageOrderValue:
        dailySales.length > 0
          ? dailySales.reduce(
              (sum, day) => sum + Number(day.avgOrderValue),
              0
            ) / dailySales.length
          : 0,
    },
  };
}

// リアルタイム通知用：低在庫アラート
export async function getLowStockAlerts() {
  const lowStockProducts = await getLowStockProducts();
  const outOfStockProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: 0,
    },
    include: {
      category: true,
    },
  });

  return {
    lowStock: lowStockProducts,
    outOfStock: outOfStockProducts,
    alerts: [
      ...lowStockProducts.map((product) => ({
        type: "low_stock" as const,
        message: `${product.name}の在庫が少なくなっています（残り${product.stock}個）`,
        severity: "warning" as const,
        productId: product.id,
      })),
      ...outOfStockProducts.map((product) => ({
        type: "out_of_stock" as const,
        message: `${product.name}が在庫切れです`,
        severity: "error" as const,
        productId: product.id,
      })),
    ],
  };
}

// 顧客分析用データ
export async function getCustomerAnalytics() {
  const totalCustomers = await prisma.customer.count();

  const newCustomersThisMonth = await prisma.customer.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  const activeCustomers = await prisma.customer.count({
    where: {
      orders: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 過去90日
          },
        },
      },
    },
  });

  return {
    total: totalCustomers,
    newThisMonth: newCustomersThisMonth,
    active: activeCustomers,
    inactive: totalCustomers - activeCustomers,
  };
}
