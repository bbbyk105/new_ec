// prisma/seed.ts - 期待値が明確なシンプルバージョン
import { PrismaClient, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 新しいシードデータを投入中...");

  // 1. カテゴリ作成
  const categories = [
    { name: "衣類", description: "ファッション・アパレル商品", sortOrder: 1 },
    { name: "食品", description: "食品・飲料・グルメ", sortOrder: 2 },
    { name: "電化製品", description: "家電・デジタル機器", sortOrder: 3 },
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
  }

  console.log("✅ カテゴリを作成しました");

  // 2. サンプル商品作成（価格を明確に設定）
  const clothingCategory = await prisma.category.findUnique({
    where: { name: "衣類" },
  });
  const foodCategory = await prisma.category.findUnique({
    where: { name: "食品" },
  });
  const electronicCategory = await prisma.category.findUnique({
    where: { name: "電化製品" },
  });

  const products = [
    // 衣類（平均 ¥5,000）
    {
      name: "Tシャツ",
      price: 3000,
      sku: "CLO-001",
      stock: 50,
      categoryId: clothingCategory!.id,
    },
    {
      name: "ジーンズ",
      price: 7000,
      sku: "CLO-002",
      stock: 30,
      categoryId: clothingCategory!.id,
    },

    // 食品（平均 ¥2,000）
    {
      name: "コーヒー豆",
      price: 1500,
      sku: "FOD-001",
      stock: 100,
      categoryId: foodCategory!.id,
    },
    {
      name: "蜂蜜",
      price: 2500,
      sku: "FOD-002",
      stock: 50,
      categoryId: foodCategory!.id,
    },

    // 電化製品（平均 ¥15,000）
    {
      name: "イヤホン",
      price: 10000,
      sku: "ELE-001",
      stock: 20,
      categoryId: electronicCategory!.id,
    },
    {
      name: "スマートウォッチ",
      price: 20000,
      sku: "ELE-002",
      stock: 15,
      categoryId: electronicCategory!.id,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        description: `${productData.name}の説明`,
        costPrice: Math.floor(productData.price * 0.6),
      },
    });
  }

  console.log("✅ サンプル商品を作成しました");

  // 3. サンプル顧客作成
  const customers = [
    {
      email: "customer1@example.com",
      name: "田中太郎",
      phone: "090-1234-5678",
    },
    {
      email: "customer2@example.com",
      name: "佐藤花子",
      phone: "090-8765-4321",
    },
    {
      email: "customer3@example.com",
      name: "鈴木一郎",
      phone: "090-1111-2222",
    },
  ];

  const createdCustomers = [];
  for (const customerData of customers) {
    const customer = await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData,
    });

    await prisma.address.upsert({
      where: { id: `addr-${customer.id}` },
      update: {},
      create: {
        id: `addr-${customer.id}`,
        customerId: customer.id,
        name: customerData.name,
        zipCode: "100-0001",
        prefecture: "東京都",
        city: "千代田区",
        address1: "千代田1-1-1",
        phone: customerData.phone,
        isDefault: true,
      },
    });

    createdCustomers.push({
      ...customer,
      addresses: [{ id: `addr-${customer.id}` }],
    });
  }

  console.log("✅ サンプル顧客を作成しました");

  // 4. 明確な注文データを作成
  const allProducts = await prisma.product.findMany();

  console.log("\n📊 期待される結果:");
  console.log("==================");

  // 2024年のデータ（完全な1年分）
  await create2024Data(createdCustomers, allProducts);

  // 2025年のデータ（1月〜今日まで）
  await create2025Data(createdCustomers, allProducts);

  // 5. 今日のデータを確実に作成
  await createTodaysData(createdCustomers, allProducts);

  // 6. 売上サマリーデータの作成
  await generateDailySalesData();

  console.log("\n🔍 データ検証を実行中...");
  await verifyAndShowExpectedResults();

  console.log("🎉 新しいシードデータの投入が完了しました！");
}

// 2024年のデータ作成（月10件、年間120件）
async function create2024Data(customers: any[], products: any[]) {
  console.log("\n📅 2024年のデータを作成中...");
  let total2024Sales = 0;
  let total2024Orders = 0;

  for (let month = 0; month < 12; month++) {
    for (let orderIndex = 0; orderIndex < 10; orderIndex++) {
      const day = Math.floor(Math.random() * 28) + 1; // 1-28日
      const orderDate = new Date(2024, month, day);

      const order = await createSampleOrder(
        customers,
        products,
        orderDate,
        2024,
        month,
        orderIndex
      );
      total2024Sales += Number(order.total);
      total2024Orders++;
    }
  }

  console.log(
    `✅ 2024年: ${total2024Orders}件の注文、総売上 ¥${total2024Sales.toLocaleString()}`
  );
  console.log(
    `   平均注文単価: ¥${Math.round(
      total2024Sales / total2024Orders
    ).toLocaleString()}`
  );
}

// 2025年のデータ作成（1月〜6月、月5件）
async function create2025Data(customers: any[], products: any[]) {
  console.log("\n📅 2025年のデータを作成中（1月〜6月）...");
  let total2025Sales = 0;
  let total2025Orders = 0;

  for (let month = 0; month < 6; month++) {
    // 1月〜6月
    for (let orderIndex = 0; orderIndex < 5; orderIndex++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const orderDate = new Date(2025, month, day);

      const order = await createSampleOrder(
        customers,
        products,
        orderDate,
        2025,
        month,
        orderIndex
      );
      total2025Sales += Number(order.total);
      total2025Orders++;
    }
  }

  console.log(
    `✅ 2025年(1-6月): ${total2025Orders}件の注文、総売上 ¥${total2025Sales.toLocaleString()}`
  );
  console.log(
    `   平均注文単価: ¥${Math.round(
      total2025Sales / total2025Orders
    ).toLocaleString()}`
  );
}

// 今日のデータ作成（確実に5件）
async function createTodaysData(customers: any[], products: any[]) {
  console.log("\n📅 今日（2025/7/2）のデータを作成中...");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  let todaysSales = 0;
  const todaysOrders = [];

  for (let i = 0; i < 5; i++) {
    const orderTime = new Date(year, month, day, 10 + i, 30); // 10:30, 11:30, 12:30, 13:30, 14:30
    const order = await createSampleOrder(
      customers,
      products,
      orderTime,
      year,
      month,
      i,
      true
    );
    todaysSales += Number(order.total);
    todaysOrders.push(order);
  }

  console.log(`✅ 今日: 5件の注文、総売上 ¥${todaysSales.toLocaleString()}`);
  console.log(
    `   平均注文単価: ¥${Math.round(todaysSales / 5).toLocaleString()}`
  );

  todaysOrders.forEach((order) => {
    console.log(
      `   ${order.orderNumber}: ¥${Number(order.total).toLocaleString()}`
    );
  });

  return { sales: todaysSales, orders: 5 };
}

// 注文作成の共通関数
async function createSampleOrder(
  customers: any[],
  products: any[],
  orderDate: Date,
  year: number,
  month: number,
  orderIndex: number,
  isToday: boolean = false
) {
  const customer = customers[Math.floor(Math.random() * customers.length)];

  const orderNumber = `ORD-${year}${String(month + 1).padStart(2, "0")}${String(
    orderDate.getDate()
  ).padStart(2, "0")}-${String(orderIndex + 1).padStart(3, "0")}`;

  // シンプルな商品選択（1-2個）
  const selectedProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 1);

  let subtotal = 0;
  const orderItems = selectedProducts.map((product) => {
    const quantity = 1; // 数量は1個に固定してシンプルに
    const itemTotal = Number(product.price) * quantity;
    subtotal += itemTotal;

    return {
      productId: product.id,
      quantity,
      unitPrice: product.price,
      total: itemTotal,
    };
  });

  const shippingFee = subtotal >= 5000 ? 0 : 500;
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + shippingFee + tax;

  return await prisma.order.create({
    data: {
      orderNumber,
      customerId: customer.id,
      addressId: customer.addresses[0].id,
      status: "DELIVERED",
      subtotal,
      shippingFee,
      tax,
      total,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      paymentStatus: "COMPLETED",
      deliveredAt: orderDate,
      createdAt: orderDate,
      orderItems: {
        create: orderItems,
      },
    },
  });
}

// 売上サマリーデータ生成
async function generateDailySalesData() {
  console.log("\n📊 売上サマリーデータを生成中...");

  await prisma.dailySales.deleteMany();
  await prisma.categorySales.deleteMany();

  const orders = await prisma.order.findMany({
    where: { status: "DELIVERED", deliveredAt: { not: null } },
    include: {
      orderItems: { include: { product: { include: { category: true } } } },
    },
  });

  const salesByDate = new Map();
  const categorySalesByDate = new Map();

  orders.forEach((order) => {
    if (!order.deliveredAt) return;

    const dateKey = order.deliveredAt.toISOString().split("T")[0];
    const date = new Date(dateKey + "T00:00:00.000Z");

    if (!salesByDate.has(dateKey)) {
      salesByDate.set(dateKey, {
        date,
        totalSales: 0,
        totalOrders: 0,
        totalItems: 0,
      });
    }

    const dailyData = salesByDate.get(dateKey);
    dailyData.totalSales += Number(order.total);
    dailyData.totalOrders += 1;
    dailyData.totalItems += order.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // カテゴリ別売上
    order.orderItems.forEach((item) => {
      const categoryKey = `${dateKey}-${item.product.categoryId}`;
      if (!categorySalesByDate.has(categoryKey)) {
        categorySalesByDate.set(categoryKey, {
          date,
          categoryId: item.product.categoryId,
          sales: 0,
          orders: new Set(),
          items: 0,
        });
      }
      const categoryData = categorySalesByDate.get(categoryKey);
      categoryData.sales += Number(item.total);
      categoryData.orders.add(order.id);
      categoryData.items += item.quantity;
    });
  });

  // daily_salesテーブルに保存
  for (const [, data] of salesByDate) {
    await prisma.dailySales.create({
      data: {
        date: data.date,
        totalSales: data.totalSales,
        totalOrders: data.totalOrders,
        totalItems: data.totalItems,
        avgOrderValue: data.totalSales / data.totalOrders,
      },
    });
  }

  // category_salesテーブルに保存
  for (const [, data] of categorySalesByDate) {
    await prisma.categorySales.create({
      data: {
        date: data.date,
        categoryId: data.categoryId,
        sales: data.sales,
        orders: data.orders.size,
        items: data.items,
      },
    });
  }

  console.log(`✅ daily_sales: ${salesByDate.size}件作成`);
  console.log(`✅ category_sales: ${categorySalesByDate.size}件作成`);
}

// 検証と期待結果の表示
async function verifyAndShowExpectedResults() {
  // 今日の検証
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const todayStart = new Date(todayString + "T00:00:00.000Z");

  const todaysOrders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: {
        gte: todayStart,
        lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  const todaysSales = todaysOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  // 今日のdaily_salesデータ確認
  const todaysDailySales = await prisma.dailySales.findUnique({
    where: { date: todayStart },
  });

  console.log(`\n📅 今日（${todayString}）の検証結果:`);
  console.log(
    `   注文テーブル: ${
      todaysOrders.length
    }件, ¥${todaysSales.toLocaleString()}`
  );
  console.log(
    `   daily_sales: ${todaysDailySales?.totalOrders || 0}件, ¥${Number(
      todaysDailySales?.totalSales || 0
    ).toLocaleString()}`
  );

  if (
    todaysDailySales &&
    todaysOrders.length === todaysDailySales.totalOrders
  ) {
    console.log("   ✅ データの整合性: OK");
  } else {
    console.log("   ❌ データの整合性: NG");
  }

  // 年度別統計
  const stats2024 = await getYearStats(2024);
  const stats2025 = await getYearStats(2025);

  console.log(`\n📊 期待される結果:`);
  console.log(`==================`);
  console.log(`2024年:`);
  console.log(`   注文数: ${stats2024.orders}件`);
  console.log(`   売上: ¥${stats2024.sales.toLocaleString()}`);
  console.log(
    `   平均注文単価: ¥${Math.round(
      stats2024.sales / stats2024.orders
    ).toLocaleString()}`
  );

  console.log(`2025年:`);
  console.log(`   注文数: ${stats2025.orders}件`);
  console.log(`   売上: ¥${stats2025.sales.toLocaleString()}`);
  console.log(
    `   平均注文単価: ¥${Math.round(
      stats2025.sales / stats2025.orders
    ).toLocaleString()}`
  );

  console.log(`\n📱 ダッシュボードで期待される表示:`);
  console.log(`============================`);
  console.log(`【2025年選択時】`);
  console.log(`   当日の売上: ¥${todaysSales.toLocaleString()}`);
  console.log(`   7月の売上: ¥${todaysSales.toLocaleString()}（今日のみ）`);
  console.log(`   2025年の売上: ¥${stats2025.sales.toLocaleString()}`);
  console.log(
    `   平均注文単価: ¥${Math.round(
      stats2025.sales / stats2025.orders
    ).toLocaleString()}`
  );

  console.log(`【2024年選択時】`);
  console.log(
    `   平均注文単価: ¥${Math.round(
      stats2024.sales / stats2024.orders
    ).toLocaleString()}`
  );
  console.log(
    `   月平均売上: ¥${Math.round(stats2024.sales / 12).toLocaleString()}`
  );
  console.log(`   2024年の売上: ¥${stats2024.sales.toLocaleString()}`);
}

// 年度別統計取得
async function getYearStats(year: number) {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  const orders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { gte: startOfYear, lte: endOfYear },
    },
  });

  const sales = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return { orders: orders.length, sales };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
