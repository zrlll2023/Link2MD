import type { NextConfig } from 'next';

// GitLab Pages 部署时环境变量 GITLAB_CI 为 'true'
// 本地开发不会有这个变量，所以 basePath 只在 CI 构建时生效
const isGitLabPages = process.env.GITLAB_CI === 'true';

const nextConfig: NextConfig = {
  // 静态导出模式：生成纯 HTML/CSS/JS 文件到 out/ 目录
  // 仅在 GitLab Pages 部署时启用，Vercel 部署时不启用
  ...(isGitLabPages && {
    output: 'export',
    trailingSlash: true,
    // GitLab Pages 子路径适配
    basePath: '/Link2MD',
    assetPrefix: '/Link2MD/',
  }),

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
};

export default nextConfig;