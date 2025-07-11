import { TokenPayload } from "@repo/shared-types";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth", "/api/auth"]; // Kullanıcı giriş yaptığında erişilemez
const USER_ROUTES = ["/user", "/api/user"]; // Kullanıcı giriş yaptığında erişebilir
const ADMIN_ROUTES = ["/admin", "/api/admin"]; // Sadece admin erişebilir

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // .well-known isteklerini atla
  if (pathname.startsWith("/.well-known")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value || null;
  const refreshToken = request.cookies.get("refresh_token")?.value || null;

  let tokenPayload: TokenPayload | null = null;
  let response: NextResponse | null = null;

  if (accessToken) {
    tokenPayload = await validateAccessToken(accessToken);
  } else if (refreshToken) {
    const refreshResult = await attemptTokenRefresh(refreshToken);

    if (refreshResult.success && refreshResult.newAccessToken) {
      tokenPayload = await validateAccessToken(refreshResult.newAccessToken);

      response = NextResponse.next();
      refreshResult.cookies?.forEach((cookie) => {
        response!.headers.append("Set-Cookie", cookie);
      });
    }
  }

  const isLoggedIn = !!tokenPayload;
  const isAdmin = isLoggedIn && tokenPayload?.role === "ADMIN";

  // Route kontrolü
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isUserRoute = USER_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // 1. AUTH ROUTES - Giriş yapan kullanıcılar erişemez
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. USER ROUTES - Sadece giriş yapan kullanıcılar erişebilir
  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Refresh işleminden gelen response varsa onu döndür
  if (response) {
    return response;
  }

  return NextResponse.next();
}

async function validateAccessToken(
  accessToken: string
): Promise<TokenPayload | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const tokenData = await response.json();
    return tokenData as TokenPayload;
  } catch {
    return null;
  }
}

async function attemptTokenRefresh(refreshToken: string): Promise<{
  success: boolean;
  newAccessToken?: string;
  cookies?: string[];
}> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const setCookies = response.headers.getSetCookie();

    let newAccessToken: string | undefined;
    setCookies.forEach((cookie) => {
      if (cookie.includes("access_token=")) {
        const match = cookie.match(/access_token=([^;]+)/);
        if (match) {
          newAccessToken = match[1];
        }
      }
    });

    return {
      success: true,
      newAccessToken,
      cookies: setCookies,
    };
  } catch {
    return { success: false };
  }
}

export const config = {
  matcher: [
    "/((?!_next|.well-known|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
