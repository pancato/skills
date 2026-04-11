---
name: sbti-cli
description: Use when the user mentions SBTI, sbti-cli, @pancato/sbti-cli, personality scoring, type lookup, batch scoring, prompt-based SBTI inference, or asks in Chinese about SBTI 测试、人格查询、批量评分、JSON 输出、离线 CLI、或 npm 包调用。
---

# sbti-cli

中文：用这个 skill 来理解和使用 npm 包 `@pancato/sbti-cli`。  
English: Use this skill to understand and operate the published npm package `@pancato/sbti-cli`.

`sbti-cli` is an offline-first TypeScript CLI with two modes.

中文：

- 面向人的交互流程，例如 `sbti test`
- 面向 agent 的 JSON 命令，例如 `score`、`batch`、`types`、`show`、`dimensions`、`export`、`analyze-prompt`

English:

- human-friendly terminal flows such as `sbti test`
- agent-friendly JSON commands such as `score`, `batch`, `types`, `show`, `dimensions`, `export`, and `analyze-prompt`

## Default Invocation / 默认调用

Prefer the installed CLI command first:

```bash
sbti <command> ...
```

If the package is not installed yet, prefer one-off execution via npm:

```bash
npx -y @pancato/sbti-cli <command> ...
```

Do not default to a repo-local path when ordinary package usage is enough.

Only use the source repository for maintenance, debugging, or behavior verification. If the local source repo exists, it may be at:

`/Users/caibaba/Documents/2026/sbti-cli`

The package targets Node.js `>=20.19.0`.

## Language Policy / 语言策略

- If the user is writing in Chinese, answer in Chinese first and keep command examples valid.
- If the user is writing in English, answer in English first.
- If the conversation is mixed, you may answer bilingually.
- The references in this skill are bilingual, so load only the sections you need.

## Workflow / 工作流

1. 中文：先判断用户要的是交互式流程，还是 agent / 数据流程。 English: First decide whether the user wants an interactive human flow or an agent/data flow.
2. 中文：面向 agent 或自动化时，默认加 `--json`。 English: For agent or automation work, default to `--json`.
3. 中文：查人格或元数据时，先用只读命令，再考虑推断。 English: For type lookup or metadata, prefer read-only commands before inference.
4. 中文：用 `analyze-prompt` 时，必须明确说明它是推断，不是正式问卷结果。 English: When using `analyze-prompt`, explicitly label the result as inference rather than a questionnaire outcome.
5. 中文：只有用户明确要求刷新或对比上游数据时才运行 `update`。 English: Use `update` only when the user explicitly asks for an upstream refresh or diff.

## Command Selection / 命令选择

- `test`: 中文：交互式问卷。 English: Interactive questionnaire for humans.
- `types`: 中文：列出全部人格。 English: List all SBTI types.
- `show <typeCode>`: 中文：查看单个人格，大小写不敏感。 English: Inspect one type; lookup is case-insensitive.
- `dimensions`: 中文：查看 15 个维度及档位说明。 English: Inspect the 15 dimensions and tier explanations.
- `export --format json`: 中文：导出标准化快照数据。 English: Export normalized snapshot data.
- `score --answers <file-or-json>`: 中文：计算单个答题载荷。 English: Score one answer payload.
- `batch --input <file>`: 中文：批量计算多个答题载荷。 English: Score multiple answer payloads from a JSON file.
- `analyze-prompt --stdin` or `--text`: 中文：根据自由文本做启发式推断。 English: Heuristic inference from freeform text.
- `update`: 中文：抓取并标准化上游数据。 English: Fetch and normalize upstream data, then report snapshot diffs.

Load [references/commands.md](./references/commands.md) when you need exact command recipes, bilingual examples, or maintainer notes.

Load [references/json-contracts.md](./references/json-contracts.md) when you need bilingual input/output shapes for automation.

Use [scripts/make-answer-payload.mjs](./scripts/make-answer-payload.mjs) when you need to scaffold a deterministic `score` or `batch` payload quickly.

## Guardrails / 注意事项

- 中文：不要把 `analyze-prompt` 说成等价于完整问卷。 English: Do not present `analyze-prompt` as equivalent to the full questionnaire.
- 中文：不要悄悄运行 `update`，因为它依赖网络。 English: Do not use `update` silently; it depends on the network.
- 中文：长 JSON 优先写临时文件，不要塞超长内联参数。 English: Prefer temp files over giant inline JSON blobs when payloads get long.
- 中文：向用户回报结果时，除非用户明确要求，否则优先总结而不是整段粘贴大 JSON。 English: Summarize large JSON outputs unless the user explicitly asks for the full payload.

## Maintainer Notes / 维护说明

If you need to verify behavior from source instead of package docs, inspect the local source repo when available:

- `src/cli/index.ts`: command routing
- `src/cli/commands/*.ts`: per-command behavior
- `src/core/scoring/parseScoreInput.ts`: `score` and `batch` input parsing rules
- `src/core/inference/analyzePrompt.ts`: keyword-based inference heuristics
- `test/cli/*.test.ts` and `test/inference/*.test.ts`: expected CLI behavior
