# 贡献指南 (Contributing Guide)

感谢你对 Link2MD 的关注与支持！我们欢迎任何形式的贡献，无论是报告 Bug、提出新功能建议，还是直接提交代码改进。

在您参与贡献之前，请花几分钟时间阅读以下指南。

## 如何参与

### 1. 报告 Bug
如果您在使用过程中发现问题，请在 [GitHub Issues](https://github.com/night-20/Link2MD/issues) 中提交。
- 请使用清晰且描述性的标题。
- 描述复现问题的具体步骤。
- 提供您的运行环境（浏览器版本、操作系统等）。
- 如果可能，附上截图或错误日志。

### 2. 提交新功能建议
如果您有好的想法，欢迎在 [GitHub Issues](https://github.com/night-20/Link2MD/issues) 中发起讨论。
- 说明该功能解决的具体痛点。
- 描述您期望的功能实现方式。

### 3. 提交代码改进 (Pull Request)

如果您想直接改进代码，请遵循以下流程：

1. **Fork** 本仓库到您的 GitHub 账号。
2. **Clone** 您的 Fork 仓库到本地：
   ```bash
   git clone https://github.com/night-20/Link2MD
   ```
3. **创建特性分支**：
   ```bash
   git checkout -b feature/your-feature-name
   # 或者修复 Bug 分支
   git checkout -b fix/your-bug-fix
   ```
4. **进行开发**：
   - 确保代码符合现有的风格。
   - 保持代码简洁且有必要的注释。
5. **本地测试**：
   ```bash
   npm install
   npm run dev
   ```
   并在提交前运行 Lint 检查：
   ```bash
   npm run lint
   ```
6. **提交代码**：
   ```bash
   git add .
   git commit -m "feat: 描述您的修改内容"
   ```
   请遵循常规提交规范（Conventional Commits），例如 `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`。
7. **推送分支**：
   ```bash
   git push origin your-branch-name
   ```
8. **在 GitHub 上发起 Pull Request**：
   - 请在 PR 描述中详细说明您的修改内容。
   - 如果修复了某个 Issue，请在描述中引用，例如 `Closes #123`。

## 技术栈

- **前端**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **转换核心**: Turndown, Cheerio, Axios
- **渲染**: react-markdown

## 代码规范

- 使用 TypeScript 编写代码，确保类型定义准确。
- 遵循 ESLint 配置规则（可通过 `npm run lint` 检查）。
- 保持组件的原子化和可重用性。
- 修改 UI 时，请注意适配暗黑模式和移动端响应式。

## 核心开发任务 (Roadmap)

我们目前重点关注：
- 适配更多国内/国外主流社交与技术平台。
- 提高 Markdown 转换的精准度。

## 联系方式

如果您有任何疑问，可以通过 GitHub Issue 与我取得联系。

再次感谢您的贡献！
