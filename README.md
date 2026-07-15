# Link2MD

将任意网页文章一键转换为干净的 Markdown 格式，支持多平台内容提取、批量下载（含图片）及多模型 AI 文章分析 Agent。

## 功能特性

- **网页转 Markdown**：输入 URL，自动爬取正文内容并转换为标准 Markdown。
- **多平台适配**：
  - **国内平台**：微信公众号、CSDN、掘金、牛客网、**Boss 直聘**。
  - **学术/生命科学**：**PubMed** (`pubmed.ncbi.nlm.nih.gov`)、**NCBI GEO** (`ncbi.nlm.nih.gov/geo`)。
- **实时预览**：Markdown 编辑器与渲染预览双栏显示。
- **一键复制 / 下载**：将转换结果直接复制到剪贴板或下载为单个 `.md` 文件。
- **批量下载（含图片）**：点击**一键下载**，将 Markdown 文档及文档中所有图片打包为 ZIP 文件下载到本地。
- **图片链接格式可选**：点击右上角 ⚙ 设置，在 Obsidian 风格 (`![[filename.png]]`) 和标准 Markdown (`![alt](path)`) 间切换，默认 Obsidian 风格。
- **搜索历史管理**：
  - 右侧面板自动记录最近 **30 条** 历史搜索。
  - 仅限本次会话，支持点击快速回填展示。
  - 自动去重，保留最近一次搜索记录。
- **AI 文章分析 Agent**：左侧面板集成多模型 AI，支持一键分析、多轮对话。

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

浏览器访问 `http://localhost:3000`。

## 使用流程

1. **转换**：粘贴支持平台的 URL，点击**一键转换**。
2. **管理历史**：点击右上角**历史**按钮查看或清空最近搜索记录。
3. **AI 分析**：点击左上角 **☰**，配置 API Key 后使用**一键分析**或对话功能。
4. **下载**：
   - 下载纯 Markdown：点击预览区顶部的下载图标。
   - 批量下载（含图片）：点击输入区右侧的**一键下载**，自动打包为 ZIP。
5. **设置图片格式**：点击右上角 ⚙，选择 Obsidian 风格或标准 Markdown。

## 技术栈

- [Next.js](https://nextjs.org) — 全栈框架
- [Turndown](https://github.com/mixmark-io/turndown) — HTML → Markdown 转换核心
- [Cheerio](https://cheerio.js.org/) & [Axios](https://axios-http.com/) — 高效内容爬取
- [JSZip](https://stuk.github.io/jszip/) — 服务端 ZIP 打包
- [react-markdown](https://github.com/remarkjs/react-markdown) — 即时渲染
- [Lucide React](https://lucide.dev) — UI 图标

## 部署

推荐部署在 [Vercel](https://vercel.com)。（注意：服务端 API 功能需要启用 Vercel Serverless Functions）

## 免责声明

本网站由个人出于兴趣爱好搭建，内容仅供学习与技术交流使用。请勿将本站用于任何商业、娱乐或其他违规目的。使用本站即表示您已阅读并同意以上声明。
