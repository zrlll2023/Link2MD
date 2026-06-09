import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ─── 服务端密钥（运行时生成，重启后失效，可通过环境变量固定）──────────────────
const SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');

// ─── 凭证仅存服务端，客户端永远看不到 ─────────────────────────────────────────
const VALID_USERNAME = 'admin';
// 存储密码的 SHA-256 哈希，而非明文
const VALID_PASSWORD_HASH = crypto.createHash('sha256').update('test').digest('hex');

// ─── 创建签名 Session Token ──────────────────────────────────────────────────
function createSessionToken(): string {
    const payload = `${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
    const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    return Buffer.from(JSON.stringify({ payload, sig })).toString('base64url');
}

// ─── 验证 Session Token ──────────────────────────────────────────────────────
function verifySessionToken(token: string): boolean {
    try {
        const { payload, sig } = JSON.parse(Buffer.from(token, 'base64url').toString());
        const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
        const sigBuf = Buffer.from(sig, 'hex');
        const expBuf = Buffer.from(expected, 'hex');
        if (sigBuf.length !== expBuf.length) return false;
        // 使用恒定时间比较，防止时序攻击
        return crypto.timingSafeEqual(sigBuf, expBuf);
    } catch {
        return false;
    }
}

// ─── IP 级别暴力破解防护（内存速率限制）────────────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
    // 获取真实 IP（支持反向代理）
    const ip =
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        'unknown';

    const now = Date.now();

    // 1. 速率限制：每 IP 每分钟最多 5 次尝试
    const record = loginAttempts.get(ip);
    if (record) {
        if (now < record.resetAt) {
            if (record.count >= 5) {
                return NextResponse.json(
                    { error: '登录尝试次数过多，请 1 分钟后再试' },
                    { status: 429 }
                );
            }
            record.count++;
        } else {
            loginAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
        }
    } else {
        loginAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    }

    // 2. 解析请求体
    let username: string, password: string;
    try {
        const body = await req.json();
        username = typeof body.username === 'string' ? body.username : '';
        password = typeof body.password === 'string' ? body.password : '';
    } catch {
        return NextResponse.json({ error: '请求格式无效' }, { status: 400 });
    }

    if (!username || !password) {
        return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }

    // 3. 服务端校验——使用哈希和恒定时间比较，防止时序攻击
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    const validBuf = Buffer.from(VALID_PASSWORD_HASH, 'hex');
    const inputBuf = Buffer.from(inputHash, 'hex');

    const usernameOk = username === VALID_USERNAME;
    const passwordOk =
        validBuf.length === inputBuf.length && crypto.timingSafeEqual(validBuf, inputBuf);

    if (!usernameOk || !passwordOk) {
        // 固定延迟：防止通过响应时间推测用户名是否存在
        await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
        return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    // 4. 登录成功：签发 Session，写入 httpOnly Cookie
    const token = createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set('link2md_session', token, {
        httpOnly: true,      // JS 无法读取，防 XSS
        sameSite: 'strict',  // 防 CSRF
        secure: process.env.NODE_ENV === 'production', // HTTPS only（生产环境）
        maxAge: 60 * 60 * 8, // 8 小时
        path: '/',
    });

    // 登录成功后清除此 IP 的失败计数
    loginAttempts.delete(ip);

    return res;
}
