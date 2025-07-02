// prisma/seed.ts
import { PrismaClient, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 シードデータを投入中...");

  // 2. カテゴリ作成
  const categories = [
    { name: "衣類", description: "ファッション・アパレル商品", sortOrder: 1 },
    { name: "食品", description: "食品・飲料・グルメ", sortOrder: 2 },
    { name: "電化製品", description: "家電・デジタル機器", sortOrder: 3 },
    { name: "その他", description: "その他の商品", sortOrder: 4 },
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
  }

  console.log("✅ カテゴリを作成しました");

  // 3. サンプル商品作成
  const clothingCategory = await prisma.category.findUnique({
    where: { name: "衣類" },
  });

  const foodCategory = await prisma.category.findUnique({
    where: { name: "食品" },
  });

  const electronicCategory = await prisma.category.findUnique({
    where: { name: "電化製品" },
  });

  if (clothingCategory && foodCategory && electronicCategory) {
    const products = [
      {
        name: "オーガニックコットンTシャツ",
        description: "肌に優しいオーガニックコットン100%のTシャツ",
        price: 2980,
        costPrice: 1500,
        sku: "CLO-TSH-001",
        stock: 50,
        categoryId: clothingCategory.id,
      },
      {
        name: "デニムジャケット",
        description: "ヴィンテージ風デニムジャケット",
        price: 8900,
        costPrice: 4500,
        sku: "CLO-JKT-001",
        stock: 25,
        categoryId: clothingCategory.id,
      },
      {
        name: "有機栽培コーヒー豆",
        description: "エチオピア産有機栽培コーヒー豆 200g",
        price: 1200,
        costPrice: 600,
        sku: "FOD-COF-001",
        stock: 100,
        categoryId: foodCategory.id,
      },
      {
        name: "国産蜂蜜",
        description: "北海道産純粋蜂蜜 300g",
        price: 2500,
        costPrice: 1200,
        sku: "FOD-HON-001",
        stock: 30,
        categoryId: foodCategory.id,
      },
      {
        name: "ワイヤレスイヤホン",
        description: "ノイズキャンセリング機能付きワイヤレスイヤホン",
        price: 12800,
        costPrice: 6500,
        sku: "ELE-EAR-001",
        stock: 20,
        categoryId: electronicCategory.id,
      },
      {
        name: "スマートウォッチ",
        description: "健康管理機能付きスマートウォッチ",
        price: 25000,
        costPrice: 12000,
        sku: "ELE-WAT-001",
        stock: 15,
        categoryId: electronicCategory.id,
      },
    ];

    for (const productData of products) {
      await prisma.product.upsert({
        where: { sku: productData.sku },
        update: {},
        create: productData,
      });
    }

    console.log("✅ サンプル商品を作成しました");
  }

  // 4. サンプル顧客作成
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

  for (const customerData of customers) {
    const customer = await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData,
    });

    // 住所情報も追加
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
        address2: "サンプルマンション101",
        phone: customerData.phone,
        isDefault: true,
      },
    });
  }

  console.log("✅ サンプル顧客を作成しました");

  // 5. サンプル注文データ作成（2024年と2025年のデータ）
  const allCustomers = await prisma.customer.findMany({
    include: { addresses: true },
  });
  const allProducts = await prisma.product.findMany();

  // 2024年のデータ（ダミーデータ）
  await generateOrdersForYear(2024, allCustomers, allProducts);

  // 2025年のデータ（現在進行中）
  await generateOrdersForYear(2025, allCustomers, allProducts);

  console.log("✅ サンプル注文データを作成しました");

  // 6. 売上サマリーデータの作成
  await generateDailySalesData();

  console.log("✅ 売上サマリーデータを作成しました");
  console.log("🎉 シードデータの投入が完了しました！");
}

// 年度別注文データ生成関数
async function generateOrdersForYear(
  year: number,
  customers: any[],
  products: any[]
) {
  const monthsToGenerate = year === 2025 ? new Date().getMonth() + 1 : 12;

  for (let month = 0; month < monthsToGenerate; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 月あたりの注文数（季節変動を考慮）
    const baseOrdersPerMonth = 20;
    const seasonalMultiplier = [
      0.8, 0.7, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.9, 1.1, 1.3, 1.5,
    ][month];
    const ordersThisMonth = Math.floor(baseOrdersPerMonth * seasonalMultiplier);

    for (let orderIndex = 0; orderIndex < ordersThisMonth; orderIndex++) {
      const randomCustomer =
        customers[Math.floor(Math.random() * customers.length)];
      const orderDay = Math.floor(Math.random() * daysInMonth) + 1;
      const orderDate = new Date(year, month, orderDay);

      // 過去の日付のみ注文を作成
      if (orderDate <= new Date()) {
        const orderNumber = `ORD-${year}${String(month + 1).padStart(
          2,
          "0"
        )}${String(orderDay).padStart(2, "0")}-${String(
          orderIndex + 1
        ).padStart(3, "0")}`;

        // ランダムな商品を選択
        const selectedProducts = products
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);

        let subtotal = 0;
        const orderItems = selectedProducts.map((product) => {
          const quantity = Math.floor(Math.random() * 3) + 1;
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

        const paymentMethods: PaymentMethod[] = [
          PaymentMethod.CREDIT_CARD,
          PaymentMethod.BANK_TRANSFER,
          PaymentMethod.COD,
        ];
        const selectedPaymentMethod =
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        await prisma.order.create({
          data: {
            orderNumber,
            customerId: randomCustomer.id,
            addressId: randomCustomer.addresses[0].id,
            status: "DELIVERED",
            subtotal,
            shippingFee,
            tax,
            total,
            paymentMethod: selectedPaymentMethod,
            paymentStatus: "COMPLETED",
            deliveredAt: orderDate,
            createdAt: orderDate,
            orderItems: {
              create: orderItems,
            },
          },
        });
      }
    }
  }
}

// 日次売上データを生成する関数
async function generateDailySalesData() {
  const orders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { not: null },
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

  // 日付ごとにグループ化
  const salesByDate = new Map<
    string,
    {
      totalSales: number;
      totalOrders: number;
      totalItems: number;
    }
  >();

  const categorySalesByDate = new Map<
    string,
    {
      date: Date;
      categoryId: string;
      sales: number;
      orders: number;
      items: number;
    }
  >();

  orders.forEach((order) => {
    if (!order.deliveredAt) return;

    const dateKey = order.deliveredAt.toISOString().split("T")[0];

    if (!salesByDate.has(dateKey)) {
      salesByDate.set(dateKey, {
        totalSales: 0,
        totalOrders: 0,
        totalItems: 0,
      });
    }

    const dailyData = salesByDate.get(dateKey);
    if (dailyData) {
      dailyData.totalSales += Number(order.total);
      dailyData.totalOrders += 1;
      dailyData.totalItems += order.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }

    // カテゴリ別売上
    order.orderItems.forEach((item) => {
      const categoryKey = `${dateKey}-${item.product.categoryId}`;

      if (!categorySalesByDate.has(categoryKey)) {
        categorySalesByDate.set(categoryKey, {
          date: new Date(dateKey),
          categoryId: item.product.categoryId,
          sales: 0,
          orders: 0,
          items: 0,
        });
      }

      const categoryData = categorySalesByDate.get(categoryKey);
      if (categoryData) {
        categoryData.sales += Number(item.total);
        categoryData.items += item.quantity;
      }
    });
  });

  // 日次売上データを保存
  for (const [dateKey, data] of salesByDate) {
    await prisma.dailySales.upsert({
      where: { date: new Date(dateKey) },
      update: {
        totalSales: data.totalSales,
        totalOrders: data.totalOrders,
        totalItems: data.totalItems,
        avgOrderValue: data.totalSales / data.totalOrders,
      },
      create: {
        date: new Date(dateKey),
        totalSales: data.totalSales,
        totalOrders: data.totalOrders,
        totalItems: data.totalItems,
        avgOrderValue: data.totalSales / data.totalOrders,
      },
    });
  }

  // カテゴリ別売上データを保存
  for (const [, data] of categorySalesByDate) {
    await prisma.categorySales.upsert({
      where: {
        date_categoryId: {
          date: data.date,
          categoryId: data.categoryId,
        },
      },
      update: {
        sales: data.sales,
        orders: data.orders,
        items: data.items,
      },
      create: data,
    });
  }
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
