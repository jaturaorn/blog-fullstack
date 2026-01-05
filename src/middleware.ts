import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. ดึง Token จาก Cookie (เพราะ Middleware เข้าถึง LocalStorage/Zustand โดยตรงไม่ได้)
  // *หมายเหตุ: เราต้องเก็บ Token ลง Cookie เพิ่มเติมเพื่อให้ Middleware อ่านได้*
  const token = request.cookies.get("auth-token")?.value;

  const isAuthPage = request.nextUrl.pathname === "/"; // หน้า Login
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // 2. ถ้าจะเข้า Dashboard แต่ไม่มี Token -> ไล่กลับไปหน้า Login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. ถ้า Login แล้วแต่อยากจะเข้าหน้า Login อีก -> ส่งไปหน้า Dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// 4. กำหนดว่าจะให้ Middleware ทำงานที่ Path ไหนบ้าง
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
