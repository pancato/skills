# sbti-cli JSON Contracts / JSON 约定

Use this reference when you need to build automation payloads or summarize structured output.

中文：当你需要构造自动化输入，或把 JSON 输出整理成更易读的摘要时，优先看这里。  
English: Read this file when you need input/output shapes for automation.

## Single-score input / 单次评分输入

`score --answers` accepts either inline JSON text or a file path.

Expected shape / 期望结构:

```json
{
  "q1": 1,
  "q2": 1,
  "q3": 1,
  "q4": 1,
  "q5": 1,
  "q6": 1,
  "q7": 1,
  "q8": 1,
  "q9": 1,
  "q10": 1,
  "q11": 1,
  "q12": 1,
  "q13": 1,
  "q14": 1,
  "q15": 1,
  "q16": 1,
  "q17": 1,
  "q18": 1,
  "q19": 1,
  "q20": 1,
  "q21": 1,
  "q22": 1,
  "q23": 1,
  "q24": 1,
  "q25": 1,
  "q26": 1,
  "q27": 1,
  "q28": 1,
  "q29": 1,
  "q30": 1
}
```

Notes / 说明:

- 中文：当前常见取值是 `1`、`2`、`3`，解析时会统一走 `Number(value)`。
- English: Typical values are `1`, `2`, and `3`, and the parser coerces values with `Number(value)`.
- 中文：测试特殊人格时，可能会看到 `drink_gate_q1`、`drink_gate_q2` 这样的额外字段。
- English: Extra gate fields such as `drink_gate_q1` and `drink_gate_q2` may appear when testing special behavior.

## Batch input / 批量输入

`batch --input` expects a JSON file containing an array.

Expected shape / 期望结构:

```json
[
  {
    "id": "case-1",
    "answers": {
      "q1": 1,
      "q2": 1,
      "q3": 1
    }
  }
]
```

Notes / 说明:

- 中文：`id` 可选；缺省时 CLI 会生成 `record-<n>`。
- English: `id` is optional; if omitted, the CLI emits `record-<n>`.
- 中文：每个 `answers` 对象的解析规则与 `score --answers` 相同。
- English: Each `answers` object is parsed the same way as `score --answers`.

## Common structured output / 常见结构化输出

`score --json` returns a full scoring result.

Most useful summary fields / 最值得优先提取的字段:

- `primaryType`
- `secondaryType`
- `bestNormal`
- `badge`
- `sub`
- `dimensions`
- `flags`
- `special`

Recommended summary order / 推荐摘要顺序:

1. `primaryType.code` and `primaryType.name`
2. `badge`
3. Whether `secondaryType` exists
4. A few notable `dimensions`

## Read-only JSON output / 只读查询的 JSON 输出

### `types --json`

Returns / 返回:

```json
{
  "snapshotVersion": "2026-04-11",
  "types": [
    {
      "code": "CTRL",
      "name": "拿捏者",
      "category": "normal",
      "intro": "怎么样，被我拿捏了吧？",
      "trigger": null
    }
  ]
}
```

### `show <typeCode> --json`

- 中文：返回完整人格记录，并附带 `templatePattern`。
- English: Returns the full type record plus `templatePattern`.

### `dimensions --json`

- 中文：返回 `snapshotVersion` 和完整的 `dimensions` 数组。
- English: Returns `snapshotVersion` and the full `dimensions` array.

### `export --format json`

Returns / 返回:

- `snapshotVersion`
- `dimensions`
- `types`
- `templates`

## Inference output / 推断输出

`analyze-prompt --json` returns the same scoring fields as `score --json`, plus:

- `mode` with value `"inferred"`
- `confidence`
- `warning`
- `matchedKeywords`

Always preserve the distinction / 始终保留这个边界:

- `score`: questionnaire-style scoring from structured answers
- `analyze-prompt`: heuristic inference from freeform text

## Helper script / 辅助脚本

If you only need a quick payload scaffold / 如果你只想快速生成一个输入样板:

```bash
node /Users/caibaba/Documents/ai/skills/sbti-cli/scripts/make-answer-payload.mjs --fill 1
```

For a batch scaffold / 批量样板:

```bash
node /Users/caibaba/Documents/ai/skills/sbti-cli/scripts/make-answer-payload.mjs --mode batch --fill 1 --id demo
```
