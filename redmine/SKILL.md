---
name: redmine
description: Use when the user asks to operate Redmine through the Redmine MCP, including 项目查询、任务创建、状态流转、附件处理、工时登记、指派给自己、或根据 issue/time entry 更新记录。
---

# redmine

中文：这个 skill 用来通过 Redmine MCP 完成 Redmine 的查询和写入操作。  
English: Use this skill to operate Redmine through the Redmine MCP.

## Hard Rule

- 必须优先使用 Redmine MCP：`redmine_paths_list`、`redmine_paths_info`、`redmine_request`、`redmine_upload`、`redmine_download`
- 不要默认改用 `curl`、浏览器点点点、或凭记忆猜字段
- 写操作前先做读取确认，至少确认项目、当前用户、状态、tracker、工时活动、以及相关自定义字段
- 如果 MCP 返回鉴权、权限、SSL、网络或服务端错误，要明确回报阻塞点，不要伪造成功结果

## Default Workflow

1. 先看接口结构  
   对第一次遇到的资源，优先用 `redmine_paths_list` / `redmine_paths_info`
2. 再补业务上下文  
   查当前用户、项目、tracker、status、priority、activity、自定义字段
3. 先查后写  
   先查现有 issue / time entry，避免重复创建
4. 再执行写操作  
   用 `redmine_request`；上传下载附件分别用 `redmine_upload` / `redmine_download`
5. 最后回报结果  
   至少说明对象 ID、标题、状态、工时、日期，以及失败原因

## Context Discovery

- 当前用户：先查 `/users/current.json`
- 项目列表：查 `/projects.json`
- 项目详情：查 `/projects/{project_id}.json`
- issue 状态：查 `/issue_statuses.json`
- tracker 列表：查 `/trackers.json`
- 工时活动：查 `/enumerations/time_entry_activities.json`
- 自定义字段：优先查 `/custom_fields.json`
- 如果 `custom_fields` 无权限，issue 相关字段可以退回到 `/projects/{project_id}.json?include=issue_custom_fields`

默认约定：

- 用户说“分配给我”“指派给自己”时，默认用 `/users/current.json` 返回的当前用户 ID
- “任务类型”优先映射为 `tracker_id`
- 如果对方实例把“任务类型”“公司”“成本中心”等做成自定义字段，再通过 `custom_fields` 写入
- “实际工时”优先写 `time_entry.hours`，不是 issue 字段
- 如果任务是父子结构，父任务默认视为结构节点；父任务不要填写 `estimated_hours`，也不要登记 `time_entry`

## Basic Operations

加载 [references/basic-operations.md](./references/basic-operations.md) 来拿常见读写模板。

常用对象：

- `issues`：创建、查询、更新任务
- `time_entries`：登记和查询工时
- `projects`：查项目和项目配置
- `attachments/uploads`：上传下载附件

## Mandatory Worklog Flow

加载 [references/worklog-two-phase.md](./references/worklog-two-phase.md) 处理“登记工时”“补工时”“补录任务并填工时”。

这是强制流程，不要压缩成一步：

1. 先创建 issue  
   需要补齐任务名、描述、指派人、预计工时，必要时补任务类型和自定义字段
2. 再更新 issue  
   把状态改为“已完成”类状态，`done_ratio` 改为 `100`，并写入备注
3. 最后创建 time entry  
   把实际工时写进 `hours`，并补 `spent_on`、`activity_id`、`comments`

根据当前需求，还要注意下面两点：

- 如果实例里要求填写“公司 / 实际公司 / 成本中心”等字段，要先查它属于 issue 还是 time entry，然后在对应步骤写入 `custom_fields`
- 即使 Redmine API 理论上允许创建时直接带 `status_id`，这里也不要把“建任务 + 已完成 + 工时登记”压成一步；按业务规则必须拆成两步 issue，再单独登记 time entry
- 如果一个 issue 已经有子任务，或者本次要先创建父任务再拆子任务，那么父任务本身不要写预计工时，也不要写实际工时；只给叶子子任务填写工时，避免 Redmine 汇总后重复累计

## Attachments

- 先用 `redmine_upload` 上传文件，拿到 token
- 再把 token 放进创建或更新 issue 时的 `uploads` 数组
- 下载附件用 `redmine_download`

## Guardrails

- `done_ratio` 按 Redmine schema 应为 `0` 到 `100`，且是 `10` 的倍数；完结时固定写 `100`
- issue 查询如果需要同时看未完成和已完成，优先使用 `status_id=*`
- 工时登记优先挂在 `issue_id` 上，这样实际工时和刚创建的任务能直接关联
- 父任务如果承担结构拆分角色，只保留标题、描述、状态、指派关系和 `parent_issue_id` / 子任务关系；不要给父任务写 `estimated_hours` 或 `time_entry`
- 同名项目、同名 tracker、多个“已完成”状态并存时，先读取候选项再做选择；只有在仍然有歧义时才简洁追问用户
- 自定义字段不要硬猜 ID；优先按名称匹配，再落到 `{id, value}` 结构

## Result Reporting

完成操作后，输出里至少包含：

- project 名称或 ID
- issue ID 和 subject
- issue 最终 status / done_ratio / assigned_to
- 预计工时和实际工时
- `spent_on` 与 time entry ID
- 任何跳过项、权限问题、连接问题或字段不确定项
