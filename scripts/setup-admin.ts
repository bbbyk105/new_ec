// scripts/setup-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 管理者アカウントを作成
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理者",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("管理者アカウントが作成されました:");
  console.log("Email: admin@example.com");
  console.log("Password: admin123");
  console.log("※本番環境では必ずパスワードを変更してください");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
