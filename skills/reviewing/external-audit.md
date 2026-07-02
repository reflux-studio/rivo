# 外审：调外部 AI CLI

把一份自包含的提示词交给本机已装的外部 AI CLI，在全新上下文里审，输出落到指定文件。统一流程：探测可用 CLI → stdin 管道灌入 → 输出落文件 → 校验非空。

## 输入约定

- `PROMPT`：提示词文件路径。必须自包含——待审产物（或 diff）、对照材料、评审清单、报告格式全部写进去，外部模型在全新上下文里执行它，文件之外的内容一概不知道。
- `OUT`：输出文件路径。
- 可选：指定的 CLI 与模型。

## 探测与宿主自排除

环境会变，每次调用前重新探测，不依赖上一轮的结果：

```bash
command -v codex >/dev/null 2>&1 && echo "codex:available"
command -v gemini >/dev/null 2>&1 && echo "gemini:available"
command -v claude >/dev/null 2>&1 && echo "claude:available"
command -v opencode >/dev/null 2>&1 && echo "opencode:available"
command -v qwen >/dev/null 2>&1 && echo "qwen:available"
command -v cursor-agent >/dev/null 2>&1 && echo "cursor:available"
```

**宿主自排除**：跑在哪个宿主里，就不把它的 CLI 当外部通道。在 Claude Code 里不调 `claude -p`（同厂商通道走 subagent，不嵌套会话）；在 Codex CLI 里同理不调 `codex exec`。

## 通用约定

- 任务可能耗时数分钟，Bash 调用给足超时（≥ 5 分钟）。
- 调用后用 `[ -s "$OUT" ]` 检查，空输出或非零退出视为本次调用失败。
- 指定了模型就传对应 model 参数，没指定用 CLI 默认。
- 多个 CLI 串行调用，不并行，避免触发限流。

## 各 CLI 配方

**codex（OpenAI）**

```bash
cat "$PROMPT" | codex exec --ephemeral --skip-git-repo-check - 2>/dev/null > "$OUT"
# pin 模型：codex exec --ephemeral --skip-git-repo-check --model "$MODEL" -
```

**gemini（Google）**

```bash
cat "$PROMPT" | gemini -p - 2>/dev/null > "$OUT"
# pin 模型：gemini -m "$MODEL" -p -
```

**claude（Anthropic）**

```bash
cat "$PROMPT" | claude -p - 2>/dev/null > "$OUT"
# pin 模型：claude --model "$MODEL" -p -
```

**opencode（可接多家模型 provider）**

```bash
cat "$PROMPT" | opencode run - 2>/dev/null > "$OUT"
# pin 模型：opencode run --model "$MODEL" -
```

**qwen（阿里 Qwen）**

```bash
cat "$PROMPT" | qwen - 2>/dev/null > "$OUT"
```

**cursor-agent（Cursor）**

prompt 走参数不走 stdin；完整提示词可能超出参数长度上限，让它读文件：

```bash
cursor-agent -p --mode ask --trust --output-format text \
  "Read the file at $PROMPT in full and carry out the request it contains. Output only the resulting markdown. Do not edit any files." \
  2>/dev/null > "$OUT"
```

**本地模型服务（OpenAI 兼容，可选）**

ollama / LM Studio / llama.cpp 共用 `/v1/chat/completions`，只有 host 与 model 不同。用 `jq --rawfile` 编码多行提示词，避免转义问题：

```bash
jq -n --rawfile p "$PROMPT" --arg m "$MODEL" \
  '{model:$m, messages:[{role:"user", content:$p}], stream:false}' \
  | curl -s --max-time 600 "$HOST/v1/chat/completions" -d @- \
  | jq -r '.choices[0].message.content' > "$OUT"
# ollama 默认 http://localhost:11434，LM Studio 默认 http://localhost:1234
```

## 失败上报

空输出 / 非零退出 / 被环境安全策略拦截 → 如实向调用方报告该 CLI 不可用及原因。换哪个替代、要不要告知用户，是调用方的决策，不自行换人、不静默重试。
