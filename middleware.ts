import { NextRequest, NextResponse } from 'next/server';

// ─── 简化版：直接放行所有请求，移除登录验证 ────────────────────────────────────
export function middleware(req: NextRequest) {
    // 添加安全 Headers
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"
    );
    return res;
}

export const config = {
    matcher: [
        // 匹配所有路由，除了 Next.js 内部静态文件
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
