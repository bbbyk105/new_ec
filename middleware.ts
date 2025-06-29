// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // ここで追加の認証ロジックを実装できます
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /adminパスの場合、認証済みかつADMINロールが必要
        if (
          req.nextUrl.pathname.startsWith("/admin") &&
          req.nextUrl.pathname !== "/admin/login"
        ) {
          return token?.role === "ADMIN";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
