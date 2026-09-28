<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Interactive Shell

Start the shell with:

```bash
liquid-agent cli
```

The shell supports assistant, blood, and chat modes. It can bind a dataset path from natural language, scan files, produce a readable plan, execute tasks, recover from safe failures, and summarize outputs.

The shell is a terminal presentation layer over the same LangGraph interaction
and analysis runtime used by the Web client. Free-form instructions are sent to
the shared intent router rather than being reduced to a fixed terminal command
table. Exact slash commands remain deterministic escape hatches.

Type `wiki` (or `/wiki`) at the CLI prompt to open the public project homepage and Docs in your browser. The CLI stays available. From a terminal, use `liquid-agent wiki`, `liquid-agt wiki`, or `liq wiki`.

## First Prompt

```text
I want to use this dataset folder: <dataset_or_subdir>
```

`<dataset_or_subdir>` may be an absolute path or a dataset name relative to the configured data root. The assistant will scan the folder and return a planning brief. If you accept the plan or give a firm instruction, it can run the feasible workflow end to end.

If the selected folder contains multiple actionable liquid-biopsy datasets, the shell automatically treats them as separate sources for one joint task. You can also start joint analysis explicitly:

```text
/use <dataset_a> <dataset_b>
```

Manage the current source list without touching files on disk:

```text
/sources
/sources add <dataset_c>
/sources remove <index|name|path>
/sources clear
```

In multi-source mode, the assistant plans source-specific preprocessing and analysis first, then writes a joint source inventory and report under `assistant/joint_reports/`.

## Common Requests

```text
Run the full analysis end to end.
```

```text
Focus on cfDNA analysis first.
```

```text
Inspect the raw signal before encoding.
```

```text
Encode this blood-biopsy batch with the most stable default encoder.
```

```text
Plot the encoded cfDNA samples and colour by the metadata column closest to HER2.
```

```text
Use the metadata table if it has reliable labels; otherwise keep the plan unsupervised.
```

```text
Explain what the last result means and where the outputs are stored.
```

```text
What encoder models do you support?
```

```text
What mature tools should I consider for fragmentomics, methylation, and CNV in this dataset?
```

Capability and support questions are checked against structured project facts. If the LLM gives a thin or incomplete answer, the shell repairs it or falls back to a deterministic answer with concrete function blocks, scripts, encoders, or docs paths.

## Primary Commands

```text
/use <path>
/sources
/mode <assistant|blood|chat>
/plan
/autopilot
/run
/review
/methods
/metadata
/llm
/skills
/output
/help
```

`/autopilot` runs the closed-loop assistant kernel: it writes versioned
`assistant/ledger/plan_*.json`, `run_*.json`, and
`result_evaluation_*.json` records as it works, then writes an audit-style
Markdown report under `assistant/reports/`. The compiled analysis graph
checkpoints conversation state separately from those scientific audit files, so
an interrupted run can reuse completed work without treating a partial task as
complete.

Method advice commands:

```text
/methods fragmentomics CNV methylation
/methods check low-pass cfDNA WGS copy number
/methods run which tools should I use for cfMeDIP and fragmentomics?
/methods cfDNAPro FinaleToolkit LBFextract fragmentomics
/methods WisecondorX HMMcopy low-pass CNV
/methods FinaleMe cfTools cfSort methylation tissue of origin
/methods MethylBERT CelFEER UXM MethAtlas cfNOMe MetDecode methylation deconvolution
/methods CpGPT MethylGPT MethFormer methylation foundation model
/methods PureCN FACETS BayesCNV CopywriteR targeted ctDNA CNV
/methods cfDNAFE cfDNAanalyzer EMIT DeepFRAG fragmentomics
```

`/methods run` writes JSON and Markdown advice reports under the analysis output root. The same route is available through natural language when the user asks for tools, algorithms, mature assay-specific methods, or research/watchlist methods.

External runtime commands:

```text
/tools
/tools status purecn
/tools bootstrap
/tools bootstrap --execute
/tools install purecn
/tools install purecn --execute
/tools smoke purecn
/tools run cnvkit -- cnvkit.py --help
```

`/tools bootstrap` and `/tools install` are dry runs unless `--execute` is present. `installed=True` means the runtime is callable. `ready=True` additionally means real input files, reference resources, model checkpoints, or panel resources are configured. Users do not manually activate isolated envs; the shell calls them through Liquid Agent wrappers.

For BED-style cohort folders, autopilot accepts plain `.bed` and `.bed.gz` files. If a user metadata table such as `metadata.csv` contains `sample_id` and a label/status column, the assistant can use it for grouped summaries and coloured visualisations. If sequence encoding needs a FASTA that has not been set, the run records that blocker and keeps going with downstream statistics and raw-signal tasks that do not need the FASTA.

Metadata commands:

```text
/metadata
/metadata use <table> <sample_col> <label_col>
/metadata ignore
/metadata rescan
```

`/metadata` shows detected metadata tables, selected label, class counts,
coverage, planning mode, and backend. `/metadata use ...` manually overrides the
selection. `/metadata ignore` rebuilds the next plan as unsupervised for the
current session.

## LLM Control

OpenAI GPT is the default online backend; Gemini 3.8 Flash is an optional backend. One OpenAI API key works across the model tiers.

```text
/llm models
/llm key
/llm use auto
/llm save
```

To use a more capable, higher-cost model, use `/llm use gpt-6-sol` or
`/llm use gpt-6-astra`, then `/llm save` to persist the choice.
`/llm delete openai` deletes the saved key and disables environment fallback.
`/llm off` is an explicit offline diagnostic mode, not an alternative provider.
Switching GPT models refreshes project docs and skill context. OpenAI failures
produce an error rather than switching providers or silently selecting a more
expensive model. See [OpenAI configuration](../guides/openai-configuration.md).

For optional Gemini use, run `/llm key gemini`, `/llm use gemini`, then
`/llm save`. Use public or non-sensitive synthetic data and check Google's
free-tier eligibility and regional terms first; see [Gemini configuration](../guides/openai-configuration.md).

## Skills

```text
/skills list
/skills ingest <path_or_url>
/skills remember <professional observation>
/skills preference <personal workflow preference>
/skills refresh
/skills context <query>
/skills explain-plan
```

Use skills for durable professional knowledge, paper-derived notes, expert
workflow observations, personal display/workflow preferences, and checking which
professional context is available for a topic.

`/skills explain-plan` shows which machine-readable skill workflows influenced
the active plan, including required outputs and quality checks.

## Exit Behavior

Slash commands work:

```text
/quit
/exit
```

Plain-language leave intents also work:

```text
bye bye
quit
exit
see you later
```

Ambiguous leave intents are confirmed before the shell exits.

## Linking tasks and memory

Use `/conversations` to list task IDs, `/link <id> <id> [...]` to begin a synthesis conversation, and `/memory` to inspect the current memory and its location. See [Linked Tasks and Local Memory](../guides/linked-tasks-and-memory.md).

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 交互式 Shell（中文）

使用以下命令启动 Shell：

```bash
liquid-agent cli
```

Shell 支持 assistant、blood 和 chat 模式。它可以从自然语言绑定数据集路径、扫描文件、生成可读计划、执行任务、从可安全处理的失败中恢复，并汇总输出。

Shell 是终端展示层，其下使用的 LangGraph 交互和分析运行时与 Web 客户端相同。自由形式的指令会发送到共享的意图路由器，而不是被压缩成固定的终端命令表。精确的斜杠命令仍作为确定性的直接操作入口保留。

在 CLI 中输入 `wiki`（或 `/wiki`），即可自动打开浏览器中的公开项目主页和 Docs，CLI 仍可继续使用。在终端中也可以运行 `liquid-agent wiki`、`liquid-agt wiki` 或 `liq wiki`。

## 第一条输入

```text
I want to use this dataset folder: <dataset_or_subdir>
```

`<dataset_or_subdir>` 可以是绝对路径，也可以是相对于已配置数据根目录的数据集名称。助手会扫描文件夹并返回规划简报。如果接受计划或给出明确指令，它可以端到端运行可行的工作流。

如果所选文件夹包含多个可处理的液体活检数据集，Shell 会自动将它们视为同一联合任务中的独立数据源。也可以显式启动联合分析：

```text
/use <dataset_a> <dataset_b>
```

管理当前数据源列表，而不触碰磁盘上的文件：

```text
/sources
/sources add <dataset_c>
/sources remove <index|name|path>
/sources clear
```

多源模式下，助手先规划每个数据源专属的预处理和分析，然后在 `assistant/joint_reports/` 下写入联合数据源清单和报告。

## 常见请求

```text
Run the full analysis end to end.
```

```text
Focus on cfDNA analysis first.
```

```text
Inspect the raw signal before encoding.
```

```text
Encode this blood-biopsy batch with the most stable default encoder.
```

```text
Plot the encoded cfDNA samples and colour by the metadata column closest to HER2.
```

```text
Use the metadata table if it has reliable labels; otherwise keep the plan unsupervised.
```

```text
Explain what the last result means and where the outputs are stored.
```

```text
What encoder models do you support?
```

```text
What mature tools should I consider for fragmentomics, methylation, and CNV in this dataset?
```

能力与支持范围的问题会依据结构化项目事实进行核对。如果 LLM 的回答过于简略或不完整，Shell 会修正回答，或回退为包含具体功能模块、脚本、编码器或文档路径的确定性回答。

## 主要命令

```text
/use <path>
/sources
/mode <assistant|blood|chat>
/plan
/autopilot
/run
/review
/methods
/metadata
/llm
/skills
/output
/help
```

`/autopilot` 运行闭环助手内核：运行时会写入带版本的 `assistant/ledger/plan_*.json`、`run_*.json` 和 `result_evaluation_*.json` 记录，随后在 `assistant/reports/` 下写入审计式 Markdown 报告。编译后的分析图将对话状态检查点与这些科学审计文件分开保存，因此中断的运行可以复用已完成工作，而不会将部分执行的任务视为完成。

方法建议命令：

```text
/methods fragmentomics CNV methylation
/methods check low-pass cfDNA WGS copy number
/methods run which tools should I use for cfMeDIP and fragmentomics?
/methods cfDNAPro FinaleToolkit LBFextract fragmentomics
/methods WisecondorX HMMcopy low-pass CNV
/methods FinaleMe cfTools cfSort methylation tissue of origin
/methods MethylBERT CelFEER UXM MethAtlas cfNOMe MetDecode methylation deconvolution
/methods CpGPT MethylGPT MethFormer methylation foundation model
/methods PureCN FACETS BayesCNV CopywriteR targeted ctDNA CNV
/methods cfDNAFE cfDNAanalyzer EMIT DeepFRAG fragmentomics
```

`/methods run` 在分析输出根目录下写入 JSON 和 Markdown 建议报告。当用户询问工具、算法、成熟的检测类型专用方法或研究/观察列表方法时，也可以通过自然语言进入同一路径。

外部运行环境命令：

```text
/tools
/tools status purecn
/tools bootstrap
/tools bootstrap --execute
/tools install purecn
/tools install purecn --execute
/tools smoke purecn
/tools run cnvkit -- cnvkit.py --help
```

除非提供 `--execute`，否则 `/tools bootstrap` 和 `/tools install` 仅进行试运行。`installed=True` 表示运行环境可调用；`ready=True` 还表示真实输入文件、参考资源、模型检查点或 panel 资源已经配置。用户不需要手动激活隔离环境；Shell 通过 Liquid Agent 包装器调用它们。

对于 BED 类队列文件夹，自动运行接受普通 `.bed` 和 `.bed.gz` 文件。如果 `metadata.csv` 等用户元数据表包含 `sample_id` 和标签/状态列，助手可以用它进行分组汇总和着色可视化。如果序列编码需要尚未配置的 FASTA，运行会记录这一阻碍，并继续执行不依赖 FASTA 的下游统计与原始信号任务。

元数据命令：

```text
/metadata
/metadata use <table> <sample_col> <label_col>
/metadata ignore
/metadata rescan
```

`/metadata` 显示检测到的元数据表、所选标签、类别计数、覆盖率、规划模式和后端。`/metadata use ...` 手动覆盖选择。`/metadata ignore` 将当前会话的下一份计划重新构建为无监督计划。

## LLM 控制

OpenAI GPT 是默认在线后端，另提供可选的 Gemini 3.8 Flash。一个 OpenAI API key 可用于不同模型档位。

Gemini 使用 `/llm key gemini`、`/llm use gemini` 和 `/llm save`。只使用公开或不敏感的合成数据，并先检查 Google 免费层资格和地区条款，详见 [Gemini 配置](../guides/openai-configuration.md)。

```text
/llm models
/llm key
/llm use auto
/llm save
```

如需能力更强、成本更高的模型，使用 `/llm use gpt-6-sol` 或 `/llm use gpt-6-astra`，然后用 `/llm save` 持久保存选择。`/llm delete openai` 删除已保存的密钥，并禁用环境变量回退。`/llm off` 是显式的离线诊断模式，而非另一家提供商。切换 GPT 模型会刷新项目文档与 skill 上下文。OpenAI 失败时会返回错误，不会切换提供商或静默选择更昂贵的模型。参见 [OpenAI 配置](../guides/openai-configuration.md)。

## Skills

```text
/skills list
/skills ingest <path_or_url>
/skills remember <professional observation>
/skills preference <personal workflow preference>
/skills refresh
/skills context <query>
/skills explain-plan
```

Skills 用于持久的专业知识、从论文提取的笔记、专家工作流观察、个人显示/工作流偏好，以及检查某个主题可用的专业上下文。

`/skills explain-plan` 显示哪些机器可读的 skill 工作流影响了当前计划，包括所需输出和质量检查。

## 退出行为

可使用斜杠命令：

```text
/quit
/exit
```

也可使用自然语言退出意图：

```text
bye bye
quit
exit
see you later
```

含义不明确的退出意图会在 Shell 退出前先要求确认。

## 链接任务与记忆

`/conversations` 列出任务 ID，`/link <id> <id> [...]` 开始综合对话，`/memory` 查看当前记忆和文件位置。详见[链接任务与本地记忆](../guides/linked-tasks-and-memory.md)。
