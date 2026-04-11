# sbti-cli Command Guide / 命令指南

## Invocation / 调用方式

Preferred package usage:

```bash
sbti <command> ...
```

If the package is not installed, use one-off npm execution:

```bash
npx -y @pancato/sbti-cli <command> ...
```

中文说明：

- 默认把 `sbti` 当成首选调用方式。
- 如果环境里还没装全局命令，再退回 `npx -y @pancato/sbti-cli`。
- 不要把本地源码仓库路径当成默认执行方式。

English notes:

- Prefer `sbti` when the package is already installed.
- Fall back to `npx -y @pancato/sbti-cli` for one-off use.
- Do not assume a repo-local executable unless you are maintaining the source repo.

## Human-facing commands / 面向人的命令

### `test`

```bash
sbti test
sbti test --json
```

```bash
npx -y @pancato/sbti-cli test
npx -y @pancato/sbti-cli test --json
```

- 中文：这是交互式问卷入口；取消时通常返回退出码 `1`。
- English: This is the interactive questionnaire flow; cancellation typically returns exit code `1`.

### `types`

```bash
sbti types
sbti types --json
```

- 中文：JSON 输出包含 `snapshotVersion` 和精简的 `types` 数组。
- English: JSON output includes `snapshotVersion` and a compact `types` array.

### `show <typeCode>`

```bash
sbti show CTRL
sbti show ctrl --json
```

- 中文：类型码大小写不敏感；JSON 会带上 `templatePattern`。
- English: Type lookup is case-insensitive; JSON includes `templatePattern`.

### `dimensions`

```bash
sbti dimensions
sbti dimensions --json
```

- 中文：JSON 输出包含全部 15 个维度及档位解释。
- English: JSON output includes all 15 dimensions and tier explanations.

## Agent-facing commands / 面向 Agent 的命令

### `score --answers <file-or-json>`

Inline JSON / 内联 JSON:

```bash
sbti score \
  --answers '{"q1":1,"q2":1,"q3":1,"q4":1,"q5":1,"q6":1,"q7":1,"q8":1,"q9":1,"q10":1,"q11":1,"q12":1,"q13":1,"q14":1,"q15":1,"q16":1,"q17":1,"q18":1,"q19":1,"q20":1,"q21":1,"q22":1,"q23":1,"q24":1,"q25":1,"q26":1,"q27":1,"q28":1,"q29":1,"q30":1}' \
  --json
```

File input / 文件输入:

```bash
sbti score --answers /tmp/sbti-answers.json --json
```

- 中文：如果 `--answers` 是存在的文件路径且不是以 `{` 开头，就按文件读取；否则按内联 JSON 解析。
- English: If `--answers` points to an existing file and does not start with `{`, the CLI reads the file; otherwise it parses inline JSON.

### `batch --input <file>`

```bash
sbti batch --input /tmp/sbti-batch.json --json
```

- 中文：输入文件必须是数组，元素形如 `{ id?, answers }`。
- English: The input file must be a JSON array of `{ id?, answers }`.

### `export --format json`

```bash
sbti export --format json
```

- 中文：当前只支持 `json`。
- English: Only `json` is currently supported.

### `analyze-prompt`

Pipe stdin / 管道输入:

```bash
printf '喜欢计划、很强控制感、总想把事情安排好' | sbti analyze-prompt --stdin --json
```

Direct text / 直接传文本:

```bash
sbti analyze-prompt --text '喜欢计划、很强控制感、总想把事情安排好' --json
```

- 中文：结果是启发式推断，不是完整问卷结果。
- English: The result is heuristic inference, not a full questionnaire result.

### `update`

```bash
sbti update
sbti update --json
```

- 中文：这是会联网的命令，只在用户明确要刷新或对比上游数据时使用。
- English: This command uses the network; only run it when the user explicitly asks for an upstream refresh or diff.

## Maintainer note / 维护备注

If you need to verify package behavior against source code, the local source repo may exist at:

`/Users/caibaba/Documents/2026/sbti-cli`

Useful source files:

- `src/cli/index.ts`
- `src/cli/commands/score.ts`
- `src/cli/commands/batch.ts`
- `src/cli/commands/show.ts`
- `src/cli/commands/types.ts`
- `src/cli/commands/dimensions.ts`
- `src/cli/commands/export.ts`
- `src/cli/commands/analyzePrompt.ts`
- `src/cli/commands/update.ts`
