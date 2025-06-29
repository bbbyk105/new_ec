// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // ここで追加の認証ロジックを実装できます
    console.log("Middleware executed for:", req.nextUrl.pathname);
    console.log("Token:", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // /admin/loginは常にアクセス可能
        if (pathname === "/admin/login") {
          return true;
        }

        // /admin配下の他のページは認証とADMINロールが必要
        if (pathname.startsWith("/admin")) {
          return !!(token && token.role === "ADMIN");
        }

        // その他のページは認証不要
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
