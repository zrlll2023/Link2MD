import type { NextConfig } from 'next';

// 只有 GitLab Pages 部署时才手动设置 DEPLOY_TARGET=gitlab-pages
// Vercel 部署和本地开发都不会有这个变量，因此 basePath / static export 不会误触
const isGitLabPages = process.env.DEPLOY_TARGET === 'gitlab-pages';

const nextConfig: NextConfig = {
  // 静态导出模式：仅 GitLab Pages 需要
  // Vercel 部署需要保留 API Routes（serverless functions），不能用 static export
  ...(isGitLabPages && { output: 'export' }),

  // GitLab Pages 子路径适配
  // 极狐 GitLab Pages 地址格式：https://用户名.jihulab.io/仓库名/
  // 需要把仓库名作为 basePath，否则静态资源路径全部 404
  ...(isGitLabPages && {
    basePath: '/Link2MD',
    assetPrefix: '/Link2MD/',
  }),

  // 静态导出时开启末尾斜杠，确保子路由能正确映射到对应 HTML 文件
  ...(isGitLabPages && { trailingSlash: true }),

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
};

export default nextConfig;