# 工时登记两阶段流程

这个流程是强制规则，专门处理“登记工时”“补工时”“补录任务并填工时”。

## 目标

先补一条规范的 issue，再把它收尾为已完成，最后单独登记实际工时。

这样做是为了符合当前业务约束：

- 不能把“创建任务”
- “直接创建成已完成”
- “顺手填完实际工时”

压缩成一个动作。

## Phase A: 创建并完结 issue

### A1. 先收集最少信息

- 项目
- 任务名
- 描述
- 指派给谁
- 预计工时
- 任务类型
- 备注

默认规则：

- 指派人没说时，优先默认当前登录用户
- 任务类型优先映射 `tracker_id`
- 预计工时写 `issue.estimated_hours`
- 如果这是父任务，且后面还会拆子任务，那么父任务不要写 `issue.estimated_hours`

### A2. 查基础映射

至少要查：

- `/users/current.json`
- `/projects.json`
- `/trackers.json`
- `/issue_statuses.json`

如果对方实例还要求公司、成本中心、归属线等字段：

- 先查 `/custom_fields.json`
- 确认它是 issue 字段还是 time entry 字段

### A3. 创建 issue

示例：

```json
{
  "path": "/issues.json",
  "method": "post",
  "data": {
    "issue": {
      "project_id": 123,
      "tracker_id": 4,
      "subject": "补登 2026-04-11 工时",
      "description": "需求沟通、开发与联调",
      "assigned_to_id": 7,
      "estimated_hours": 4
    }
  }
}
```

如果“公司 / 实际公司 / 成本中心”是 issue 自定义字段，就一起放进 `issue.custom_fields`。

父子任务规则：

- 如果当前创建的是结构性父任务，只建父任务本身，不写 `estimated_hours`
- 真正的预计工时写在子任务上
- 子任务通过 `parent_issue_id` 挂到父任务下
- 后续实际工时也只登记到子任务，不登记到父任务

### A4. 更新为已完成

创建成功后，再调用更新接口：

```json
{
  "path": "/issues/456.json",
  "method": "put",
  "data": {
    "issue": {
      "status_id": 5,
      "done_ratio": 100,
      "notes": "任务已完成，准备登记实际工时"
    }
  }
}
```

要点：

- `status_id` 必须先从 `/issue_statuses.json` 查，不要硬编码
- `done_ratio` 固定写 `100`
- 备注写在 `issue.notes`

## Phase B: 登记实际工时

### B1. 查工时活动

优先查：

```json
{ "path": "/enumerations/time_entry_activities.json", "method": "get" }
```

### B2. 创建 time entry

示例：

```json
{
  "path": "/time_entries.json",
  "method": "post",
  "data": {
    "time_entry": {
      "issue_id": 456,
      "spent_on": "2026-04-11",
      "hours": 3.5,
      "activity_id": 9,
      "comments": "开发、联调、回归",
      "user_id": 7
    }
  }
}
```

这里的关键字段：

- 实际工时写 `hours`
- 工时日期写 `spent_on`
- 工时备注写 `comments`
- 最好挂到刚创建的 `issue_id`

父子任务补充规则：

- 如果目标 issue 有子任务，并且它只是父级容器，不要给这个父任务创建 time entry
- 应把 time entry 创建到实际执行的子任务 issue 上
- 否则父任务工时和子任务工时会在汇总时累加，结果失真

## 推荐校验

完成后建议至少再读一次：

```json
{
  "path": "/issues/456.json",
  "method": "get",
  "params": { "include": "journals" }
}
```

```json
{
  "path": "/time_entries.json",
  "method": "get",
  "params": { "issue_id": "456", "spent_on": "2026-04-11", "limit": 20 }
}
```

确认以下信息都存在：

- issue 已创建
- issue 状态是已完成类状态
- `done_ratio` 为 `100`
- 预计工时已写入
- 实际工时已登记
- 备注和任务类型已落到正确字段
- 如果是父子任务结构，父任务没有填写预计工时或实际工时，工时只落在叶子子任务上
