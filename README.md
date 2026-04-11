# AI Skills

这个仓库是我本地维护的 agent skill 工作区，用来放可复用的 `SKILL.md`、参考资料和辅助脚本。

## 当前可用技能

| 技能 | 状态 | 说明 |
| :--- | :--- | :--- |
| [**sbti-cli**](./sbti-cli/) | ✅ 可用 | 帮 agent 理解并使用 npm 包 `@pancato/sbti-cli`，包括离线查询、JSON 评分、批量处理和启发式推断。 |

只把真正包含 `SKILL.md` 的目录视为可用技能。像 `redmine/` 这类空目录目前只是占位，不应该写进技能清单。

## 仓库结构

```text
skills/
  README.md
  sbti-cli/
    SKILL.md
    references/
    scripts/
  redmine/   # 占位目录，当前还不是可用 skill
```

## 约定

- 每个技能目录至少包含一个 `SKILL.md`。
- `references/` 用来放按需加载的说明文档、命令清单、数据结构说明。
- `scripts/` 用来放确定性、可复用的辅助脚本。
- 新增或删除技能时，记得同步更新这份 `README.md`，避免出现目录和文档不一致的问题。

## 当前重点

### `sbti-cli`

这个 skill 面向 npm 包 `@pancato/sbti-cli`，重点帮助 agent：

- 区分“给人用”的交互命令和“给 agent 用”的 JSON 命令
- 优先使用 `sbti` 或 `npx -y @pancato/sbti-cli`
- 正确构造 `score` / `batch` 输入
- 在使用 `analyze-prompt` 时保留“启发式推断”的边界
- 只在用户明确要求时才运行依赖网络的 `update`

## 维护提示

- 如果某个 skill 依赖外部项目，最好在 skill 内写明本地路径或默认执行方式。
- 如果 README 里出现不存在的文件、错误的安装方式或把 skill 当成 MCP server 的描述，应该优先修正。
