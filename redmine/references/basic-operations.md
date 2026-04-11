# Redmine MCP 常见操作

下面的片段是给 agent 看的 MCP 调用模板。实际执行时，把占位值替换成真实 ID、日期和文本。

## 1. 先看接口定义

第一次处理某类资源时，先读 schema，不要猜请求体：

```json
{"path_templates":["/issues.json","/issues/{issue_id}.json","/time_entries.json","/users/current.json","/projects.json"]}
```

适合交给 `redmine_paths_info`。

## 2. 识别当前用户

用户说“分配给我”“指派给自己”时，先取当前用户：

```json
{"path":"/users/current.json","method":"get"}
```

## 3. 查项目

按名称筛项目：

```json
{"path":"/projects.json","method":"get","params":{"name":"示例项目","limit":20}}
```

如果需要项目上的 tracker、分类、issue 自定义字段：

```json
{"path":"/projects/123.json","method":"get","params":{"include":"trackers,issue_categories,time_entry_activities,issue_custom_fields"}}
```

注意：

- `/issues.json` 里的 `project_id` 过滤应使用数值 ID，不要假设可以用项目标识符
- `/projects/{project_id}.json` 的路径参数可以用项目 ID 或 identifier，但后续 `issue.project_id` 仍建议写数值 ID

## 4. 查状态、任务类型、工时活动

```json
{"path":"/issue_statuses.json","method":"get"}
```

```json
{"path":"/trackers.json","method":"get"}
```

```json
{"path":"/enumerations/time_entry_activities.json","method":"get"}
```

经验规则：

- “任务类型”优先映射到 `tracker_id`
- “已完成”状态不要硬编码 ID，先从 `/issue_statuses.json` 里找名称接近“已完成 / 完成 / Resolved / Closed / Done”的状态

## 5. 查自定义字段

优先用：

```json
{"path":"/custom_fields.json","method":"get"}
```

Redmine 的 `custom_fields` 读写结构一般是：

```json
[
  {"id": 12, "value": "示例值"},
  {"id": 18, "value": ["A", "B"]}
]
```

使用原则：

- 先按字段名称找 ID，不要手写死 ID
- 单值字段用字符串
- 多选字段通常用数组
- 如果字段属于 issue，就写到 `issue.custom_fields`
- 如果字段属于 time entry，就写到 `time_entry.custom_fields`

## 6. 查 issue

查某个项目下我负责的全部任务：

```json
{"path":"/issues.json","method":"get","params":{"project_id":"123","assigned_to_id":"me","status_id":"*","sort":"id:desc","limit":50}}
```

按标题关键词筛：

```json
{"path":"/issues.json","method":"get","params":{"project_id":"123","subject":"联调","status_id":"*","limit":50}}
```

查单个任务详情并带日志：

```json
{"path":"/issues/456.json","method":"get","params":{"include":"journals,attachments,watchers,allowed_statuses"}}
```

## 7. 创建 issue

最小模板：

```json
{
  "path": "/issues.json",
  "method": "post",
  "data": {
    "issue": {
      "project_id": 123,
      "tracker_id": 4,
      "subject": "补登 2026-04-11 工时",
      "description": "整理需求、开发与联调",
      "assigned_to_id": 7,
      "estimated_hours": 4
    }
  }
}
```

如果还要写自定义字段：

```json
{
  "issue": {
    "project_id": 123,
    "subject": "示例任务",
    "custom_fields": [
      {"id": 12, "value": "上海公司"},
      {"id": 18, "value": "客户项目"}
    ]
  }
}
```

### 父子任务结构

如果任务是父子结构，先区分它是不是“结构性父任务”：

- 结构性父任务：只负责归类和拆分，不填预计工时，不登记实际工时
- 叶子子任务：真正执行工作的任务，预计工时和实际工时都填在子任务上

创建子任务时使用 `parent_issue_id`：

```json
{
  "path": "/issues.json",
  "method": "post",
  "data": {
    "issue": {
      "project_id": 123,
      "parent_issue_id": 456,
      "tracker_id": 4,
      "subject": "子任务：联调接口 A",
      "assigned_to_id": 7,
      "estimated_hours": 2
    }
  }
}
```

规则：

- 父任务有子任务时，父任务不要写 `estimated_hours`
- 父任务也不要登记 `time_entry`
- 如果发现父任务和子任务都填了工时，优先提醒并改为只保留子任务工时

## 8. 更新 issue

更新状态、进度、备注：

```json
{
  "path": "/issues/456.json",
  "method": "put",
  "data": {
    "issue": {
      "status_id": 5,
      "done_ratio": 100,
      "notes": "已完成并准备登记实际工时"
    }
  }
}
```

如果要同时补 tracker、预计工时或自定义字段，也放在同一个 `issue` 对象里。

## 9. 登记工时

推荐把 time entry 挂到 issue 上：

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
      "comments": "开发、联调与回归验证",
      "user_id": 7
    }
  }
}
```

登记前先判断目标 issue 是否为父任务：

- 如果该 issue 有子任务，且它本身只是结构节点，不要给它登记工时
- 应该把工时登记到具体执行的叶子子任务上
- 只有没有子任务、或者明确就是执行单元的 issue，才给它登记 `hours`

如果实例要求 time entry 自定义字段，比如公司、成本中心、费用归属：

```json
{
  "time_entry": {
    "issue_id": 456,
    "hours": 3.5,
    "spent_on": "2026-04-11",
    "custom_fields": [
      {"id": 31, "value": "上海公司"}
    ]
  }
}
```

## 10. 查工时

按日期区间和 issue 过滤：

```json
{"path":"/time_entries.json","method":"get","params":{"issue_id":"456","from":"2026-04-01","to":"2026-04-30","sort":"spent_on:desc","limit":100}}
```

按我自己和某天过滤：

```json
{"path":"/time_entries.json","method":"get","params":{"user_id":"7","spent_on":"2026-04-11","limit":100}}
```

## 11. 上传附件

先上传文件：

- 用 `redmine_upload`
- 得到 upload token

再在创建或更新 issue 时放入：

```json
{
  "issue": {
    "project_id": 123,
    "subject": "带附件的任务",
    "uploads": [
      {
        "token": "7167.example-token",
        "filename": "evidence.png",
        "description": "截图",
        "content_type": "image/png"
      }
    ]
  }
}
```

## 12. 下载附件

下载 Redmine 附件优先用 `redmine_download`，不要自己拼接带鉴权的下载链接。
