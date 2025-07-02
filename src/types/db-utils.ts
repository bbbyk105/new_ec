// src/types/db-utils.ts
import { prisma } from "../lib/prisma";
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

// 月次売上データ集計
export async function getMonthlySalesData(year: number) {
  const monthlyData = await prisma.$queryRaw<DailySalesQueryResult[]>`
    SELECT 
      EXTRACT(MONTH FROM date) as month,
      SUM(total_sales) as sales,
      SUM(total_orders) as orders
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

// 今月の主要KPI取得
export async function getCurrentMonthKPIs() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // 今日の売上
  const todaySales = await prisma.dailySales.findUnique({
    where: {
      date: yesterday, // 実際のデータは前日まで
    },
  });

  // 今月の累計売上
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
    _avg: {
      avgOrderValue: true,
    },
  });

  // 全期間の累計売上
  const totalAggregate = await prisma.dailySales.aggregate({
    _sum: {
      totalSales: true,
      totalOrders: true,
    },
  });

  // リピート率計算（簡易版）
  const totalCustomers = await prisma.customer.count();
  const customersWithMultipleOrders = await prisma.customer.count({
    where: {
      orders: {
        some: {
          status: OrderStatus.DELIVERED,
        },
      },
    },
  });

  const repeatRate =
    totalCustomers > 0
      ? Math.round((customersWithMultipleOrders / totalCustomers) * 100)
      : 0;

  return {
    todaySales: Number(todaySales?.totalSales || 0),
    monthlyTotal: Number(monthlyAggregate._sum.totalSales || 0),
    monthlyOrders: Number(monthlyAggregate._sum.totalOrders || 0),
    avgOrderValue: Number(monthlyAggregate._avg.avgOrderValue || 0),
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
        lte: 10, // lowStockThresholdのデフォルト値
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
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
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

// ダッシュボード用のサンプルデータ取得関数
export async function getDashboardData() {
  const currentYear = new Date().getFullYear();

  // 月次売上データ（過去9ヶ月）
  const monthlySales = await getMonthlySalesData(currentYear);

  // カテゴリ別売上データ
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const categorySales = await getCategorySalesData(startOfYear, endOfYear);

  // カテゴリ別売上を集計
  const categoryTotals = new Map<string, number>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // KPIデータ
  const kpis = await getCurrentMonthKPIs();

  return {
    monthlySales,
    categoryData,
    kpis,
  };
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
