# AI Skills

这个仓库是我本地维护的 agent skill 工作区，用来放可复用的 `SKILL.md`、参考资料和辅助脚本。

## 当前可用技能

| 技能 | 状态 | 说明 |
| :--- | :--- | :--- |
| [**redmine**](./redmine/) | ✅ 可用 | 通过 Redmine MCP 完成项目查询、任务创建、状态流转、附件处理和两阶段工时登记。 |
| [**sbti-cli**](./sbti-cli/) | ✅ 可用 | 帮 agent 理解并使用 npm 包 `@pancato/sbti-cli`，包括离线查询、JSON 评分、批量处理和启发式推断。 |

只把真正包含 `SKILL.md` 的目录视为可用技能。未来如果再出现空占位目录，不应该写进技能清单。

## 仓库结构

```text
skills/
  README.md
  redmine/
    SKILL.md
    references/
  sbti-cli/
    SKILL.md
    references/
    scripts/
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

### `redmine`

这个 skill 面向 Redmine MCP，重点帮助 agent：

- 只通过 Redmine MCP 做 Redmine 操作，而不是临时改用手写 HTTP 请求
- 在写入前先查清项目、当前用户、状态、tracker、工时活动和自定义字段
- 完成最基本的 issue 创建、更新、查询、附件上传下载和 time entry 登记
- 对“登记工时”场景强制执行“两阶段”流程
- 先创建 issue 并设置任务名、描述、指派人、预计工时
- 再把 issue 改成已完成并写备注、进度、任务类型
- 最后单独登记实际工时，并在需要时补公司或成本中心等自定义字段

## 维护提示

- 如果某个 skill 依赖外部项目，最好在 skill 内写明本地路径或默认执行方式。
- 如果 README 里出现不存在的文件、错误的安装方式或把 skill 当成 MCP server 的描述，应该优先修正。
