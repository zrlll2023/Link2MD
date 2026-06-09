# Link2MD

将任意网页文章一键转换为干净的 Markdown 格式，并内置多模型 AI 文章分析 Agent。

## 功能特性

- **网页转 Markdown**：输入 URL，自动爬取正文内容并转换为标准 Markdown。
- **多平台适配**：
  - **国内平台**：微信公众号、CSDN、掘金、牛客网、**Boss 直聘**。
  - **学术/生命科学**：**PubMed** (`pubmed.ncbi.nlm.nih.gov`)、**NCBI GEO** (`ncbi.nlm.nih.gov/geo`)。
- **实时预览**：Markdown 编辑器与渲染预览双栏显示。
- **一键复制 / 下载**：将转换结果直接复制到剪贴板或下载为 `.md` 文件。
- **搜索历史管理**：
  - 右侧面板自动记录最近 **30 条** 历史搜索。
  - 仅限本次会话，支持点击快速回填展示。
  - 自动去重，保留最近一次搜索记录。
- **AI 文章分析 Agent**：左侧面板集成多模型 AI，支持一键分析、多轮对话。
- **安全加固系统**：内置登录页面、图形验证码、密码显示切换、服务端认证及多项防御机制。

### 支持的 AI 提供商

| 提供商 | 模型 | 获取 API Key |
|--------|------|-------------|
| Google Gemini | 2.0 Flash / Pro、1.5 Pro | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| OpenAI | GPT-4o 系列、o3-mini | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic Claude | 3.5 Sonnet / Haiku、4.5 系列 | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| DeepSeek | V3 / R1 / V4 Flash / V4 Pro | [platform.deepseek.com](https://platform.deepseek.com/api_keys) |
| 智谱 GLM | GLM-4 全系列（含**免费版**） | [bigmodel.cn](https://bigmodel.cn/usercenter/apikeys) |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:3000`。首次访问需登录（默认凭证：`admin` / `test`）。

## 使用流程

1. **登录**：输入用户名密码及验证码，可切换密码显示状态。
2. **转换**：粘贴支持平台的 URL，点击**转换**。
3. **管理历史**：点击右上角**历史**按钮查看或清空最近搜索记录。
4. **AI 分析**：点击左上角 **☰**，配置 API Key 后使用**一键分析**或对话功能。
5. **下载/复制**：转换完成后，点击顶部操作按钮导出 Markdown。

## 安全特性说明

本站采用多层次安全防御方案：
- **认证安全**：服务端 SHA-256 密码哈希、httpOnly Cookie Session、防时序攻击验证。
- **前端防护**：图形验证码防自动登录、autocomplete 抑制、蜜罐字段干扰。
- **系统防护**：IP 级别登录速率限制、Next.js Middleware 路由强制保护、CSP 安全头设置。

## 技术栈

- [Next.js 16](https://nextjs.org) — 全栈全能框架
- [Turndown](https://github.com/mixmark-io/turndown) — HTML → Markdown 转换核心
- [Cheerio](https://cheerio.js.org/) & [Axios](https://axios-http.com/) — 高效内容爬取
- [react-markdown](https://github.com/remarkjs/react-markdown) — 优美的即时渲染
- [Lucide React](https://lucide.dev) & [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) — UI 图标与动态验证码

## 部署

推荐部署在 [Vercel](https://vercel.com)。(注意：服务端 API 功能需要启用 Vercel Serverless Functions)。

## 免责声明

本网站由个人出于兴趣爱好搭建，内容仅供学习与技术交流使用。请勿将本站用于任何商业、娱乐或其他违规目的。使用本站即表示您已阅读并同意以上声明。
