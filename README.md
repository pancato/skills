# 🚀 AI Skills 仓库

## 欢迎来到我的 **AI Skills** 实验室！🧪

## 🛠 技能矩阵 (Skills Matrix)

目前仓库中包含以下技能：

| 技能名称                 | 状态      | 核心功能简介                             |
| :----------------------- | :-------- | :--------------------------------------- |
| [**Redmine**](./redmine) | 🏗 开发中 | 项目追踪、Issue 管理、工时记录、附件处理 |
| **More Coming Soon...**  | ⏳ 规划中 | 更多实用的集成正在路上                   |

---

## 🧩 技能详情

### 🔴 Redmine Skill

让你的 AI 助手变成项目管理大师！

- **查询任务**：通过 ID、项目或指派人快速获取 issue 详情。
- **管理 Issue**：创建、更新、删除或批量修改任务。
- **工时审计**：记录和查询项目耗时。
- **附件管理**：自动下载/上传任务附件。

---

## 📦 快速开始与安装指南

### 1. 环境准备

确保你的系统中安装了以下软件：

- **Node.js** (v18.0.0+)
- **npm** 或 **pnpm**
- **Git**

### 2. 获取技能

```bash
git clone https://github.com/your-username/ai-skills.git
cd ai-skills
```

### 3. 主流 MCP 客户端配置

目前主流的 MCP 客户端（如 Claude Desktop）通常通过编辑配置文件来启用技能。

#### 🖥 Claude Desktop 配置

在 macOS 上，编辑以下文件：
`~/Library/Application Support/Claude/claude_desktop_config.json`

添加如下配置：

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["-y", "@path/to/your/redmine/skill"],
      "env": {
        "REDMINE_URL": "https://your-redmine.com",
        "REDMINE_API_KEY": "your_api_key_here"
      }
    },
    "agent-browser": {
      "command": "npx",
      "args": ["-y", "agent-browser", "serve"]
    }
  }
}
```

## 🤝 参与贡献

如果你有新的 Idea 或者发现了 Bug，欢迎提交 **Pull Request** 或开启 **Issue**。让我们一起构建更强大的 AI 技能库！🌟

## 📜 许可证

[MIT License](./LICENSE)

---

> 💡 **小贴士**：在使用 Redmine 技能前，请确保你已经生成了 API 访问令牌（在个人账号配置页面可以找到）。
