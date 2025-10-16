import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 不需要认证的路由
const publicRoutes = ['/login', '/register'];

// 需要认证的路由前缀
const protectedRoutePrefixes = ['/dashboard', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 获取认证令牌
  const token =
    request.cookies.get('accessToken')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  // 检查是否为公开路由
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // 检查是否为受保护的路由
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

  // 如果访问受保护的路由但没有令牌，重定向到登录页
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 如果已登录用户访问登录页，重定向到仪表板
  if (isPublicRoute && token && !pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 添加安全头部
  const response = NextResponse.next();

  // 安全头部设置
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// 配置匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
