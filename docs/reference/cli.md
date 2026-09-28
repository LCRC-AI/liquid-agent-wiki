<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# CLI Entrypoints

## Npm User Entrypoint

Node owns the user-facing command-line entrypoint. Install local command shims from the repository checkout with:

```bash
./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data"
```

Equivalent terminal form:

```bash
./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data"
```

Primary commands:

- `liquid-agent`
- `liq`
- `liquid-agt`
- `liquid-agent wiki`
- `liquid-agent cli` — explicit terminal mode
- `liquid-agent shell`
- `liquid-agent portal`
- `liquid-agent web`
- `liquid-agent client`
- `liquid-agent llm-status`
- `liquid-agent llm-configure`
- `liquid-agent update --check` / `liquid-agent update` / `liquid-agent update --rollback` (macOS/Linux/Windows)
- `liquid-agent methods ...`
- `liquid-agent results <dataset_folder>`
- `liquid-agent skills ...`
- `liquid-agent demo-check`
- `liquid-agent assistant ...`
- `liquid-agent assistant plan <dataset_folder>`
- `liquid-agent assistant run <dataset_folder>`
- `liquid-agent blood-agent ...`

Aliases:

- `liquid-portal` is equivalent to `liquid-agent portal`
- `liquid-web` is equivalent to `liquid-agent web`
- `liquid-client` is equivalent to `liquid-agent client`
- `liquidbiopsy-agent` remains as a compatibility alias for older examples

The command invokes the Python analysis kernel internally. For conda installs, the installer captures the active non-base environment and later uses `conda run`, so users do not need to activate that environment first. Use `LIQUID_AGENT_ENV=<env>` to select another conda environment, or `LIQUID_AGENT_PYTHON=/path/to/python` for a direct Python kernel.

Python module/script commands below remain available for advanced and reproducible execution, but they are no longer the preferred interactive user interface.

The terminal shell starts with a compact ready panel by default. Set
`LIQUID_AGENT_STARTUP_VERBOSE=1` to print the full shell state and command help
at startup.

## Web UI

```bash
liquid-agent web
liquid-agent web --port 8771
liquid-agent web --no-open
liquid-web
liquid-agent portal
liquid-portal
liquid-agent client
liquid-agent client --port 8771
liquid-agent client --no-open
liquid-client
```

`liquid-agent web` and `liquid-agent client` both open the local Web workspace directly at `/#/agent`. Use `liquid-agent wiki` (also `liquid-agt wiki` or `liq wiki`) to open the separately deployed public homepage and Docs. In the interactive CLI, type `wiki` or `/wiki`; the CLI stays available. `liquid-agent portal` remains a compatible public-homepage entrypoint. **Try it** opens the installation documentation in the selected language; it does not run an analysis.

Use `--no-open` for a single launch that prints the URL without opening a
browser automatically. Set `LIQUID_AGENT_NO_OPEN=1` when you want that behavior
for every browser launch in the current terminal session.

## One-Shot Assistant

```bash
liquid-agent assistant plan /path/to/dataset
liquid-agent assistant run /path/to/dataset
liquid-agent assistant --input /path/to/dataset --print-only
liquid-agent assistant --input /path/to/dataset --execute
```

`assistant plan` is a user-friendly alias for planning without execution.
`assistant run` plans and executes the recommended feasible task. The explicit
`--input` form remains available for scripts and automation.

## Metadata and Label Control

Inside the interactive shell:

```text
/metadata
/metadata use <table> <sample_col> <label_col>
/metadata ignore
/metadata rescan
```

The command reads the active dataset scan profile and reports the selected
metadata table, sample id column, label column, label counts, coverage,
confidence, supervision mode, and modeling backend. `use` overrides the
automatic selection for the current session. `ignore` disables label-aware
planning until metadata is rescanned or the session is reset.

The same metadata profile is attached to Web scan/plan responses and is
summarized in the Web Metadata card.

## Results

```bash
liquid-agent results /path/to/dataset
liquid-agent results /path/to/dataset --limit 100
liquid-agent results /path/to/dataset --json
liquid-agent results /path/to/dataset --ask 1 --question "What should I do next?"
liquid-agent results /path/to/dataset --ask 1 --llm-provider none
```

`results` lists generated Liquid Agent artifacts for a dataset, including reports,
tables, JSON summaries, static figures, and ledger audit JSON such as
`analysis_concept_book.json`. External HTML/site mirrors are filtered
out so the list stays focused on agent-generated outputs. `--ask <index>` uses the
same result-follow-up path as the interactive shell: it sends the selected artifact
metadata and a safe excerpt to the configured LLM when available, then falls back
to local artifact-context guidance if the LLM is disabled or unavailable.
Ledger JSON artifacts such as plan records, run records, result evaluations,
and concept books are summarized as plan state, task execution/verification,
QC/findings/follow-ups, or pending/actioned/blocked result-driven memory instead
of being shown as raw JSON. Autopilot Markdown reports are also summarized by
stop reason, immediate next actions, completed workflow, result evaluation, and
ledger status instead of returning only the raw excerpt. The local fallback also
uses the artifact type to suggest the next safe action, for example continuing a
recommended follow-up from a result evaluation, running a ready task from a plan,
or fixing a recorded blocker before retrying a failed run.
Plan-record follow-up summaries include the backend recommendation audit when
present, so `results --ask` can explain whether minimum-output gaps, FeatureBook
tie-breakers, or de-duplication changed the recommended task.

## Professional Skills

Npm CLI:

```bash
liquid-agent skills list
liquid-agent skills show <skill_id>
liquid-agent skills context "methylation QC encoder selection"
liquid-agent skills ingest <path_or_url> --title "Methylation Cohort Interpretation Notes"
liquid-agent skills remember "If the assay family is unclear, inspect raw signal summaries before choosing an encoder."
liquid-agent skills remember --memory-type personal --note "Show figures before long tables in demos."
liquid-agent skills preference "Show figures before long tables in demos."
liquid-agent skills root
```

Inside the interactive shell:

```text
/use <path> [path2 ...]
/sources
/sources add <path>
/sources remove <index|name|path>
/sources clear
/skills
/skills show <skill_id>
/skills ingest <path_or_url>
/skills remember <professional observation>
/skills preference <personal workflow preference>
/skills root
/skills refresh
/skills context <query>
/skills explain-plan
```

`/use <parent_folder>` can auto-detect multiple child liquid-biopsy datasets. `/sources remove ...` only detaches a source from the current task; it never deletes source files.

`/autopilot` writes closed-loop records under `assistant/ledger/`:
`plan_*.json`, `run_*.json`, and `result_evaluation_*.json`. `/skills
explain-plan` shows which machine-readable skill workflows affected the current
plan.

`liquid-agent skills ingest` accepts local files, folders, URLs, and PDFs when
the optional `skills` extra is installed. It uses the configured LLM for
distillation when available and falls back to a local heuristic skill writer
when no LLM is configured.

Personal preferences can be saved explicitly from the shell or naturally in chat:

```text
/skills preference show plots first and keep the demo explanation concise.
Remember my preference: show plots first and keep the demo explanation concise.
```

Those notes are stored in `user-workflow-preferences`; expert or professional
observations remain in `professional-practice-notes`.

The local web backend also exposes:

- `GET /api/session/{session_id}/sources`
- `POST /api/session/{session_id}/sources`
- `DELETE /api/session/{session_id}/sources/{selector}`
- `DELETE /api/session/{session_id}/sources`
- `GET /api/skills`
- `GET /api/skills/{skill_id}`
- `POST /api/skills/refresh`
- `POST /api/session/{session_id}/skills/ingest`
- `POST /api/session/{session_id}/skills/remember`
- `GET /api/methods`
- `POST /api/session/{session_id}/methods/advice`

PDF ingestion requires the optional `skills` extra:

```bash
python -m pip install -e "[skills]"
```

## Preprocessing

- `python scripts/preprocess_epigenomic_signal.py`
- `python scripts/preprocess_lpwgs_signal.py`
- `python scripts/preprocess_variant_signal.py`

## Blood Encoding

- `python scripts/encode_cfdna_foundation_features.py`
- `python scripts/encode_epigenomic_signal_features.py`
- `python scripts/encode_lpwgs_features.py`
- `python scripts/encode_variant_features.py`

## cfDNA Downstream

- `python scripts/run_cfdna_plot_suite.py`
- `python scripts/run_cfdna_analysis_suite.py`
- `python scripts/run_cfdna_raw_signal_suite.py`
- `python scripts/run_cfdna_raw_signal_analysis_suite.py`

The standard cfDNA plotting CLI accepts `--projection {auto,umap,tsne,pca}` and defaults to `auto`.

Standard analysis and plotting can also consume processed supplied matrices:

```bash
python scripts/run_cfdna_analysis_suite.py \
  --cnv_matrix_table <cnv_matrix.tsv[.gz]> \
  --output_dir <analysis_output_dir>

python scripts/run_cfdna_plot_suite.py \
  --methylation_matrix_table <methylation_matrix.tsv[.gz]> \
  --output_dir <visualisation_output_dir>
```

Use `--signal_matrix_table` for other liquid-biopsy numeric matrices. Large
tables are read responsively by default with `--matrix_max_source_rows 50000`;
set it to `0` to read all rows.

## Liquid-Biopsy Method Advisor

Interactive shell:

```text
/methods fragmentomics CNV methylation
/methods check low-pass cfDNA WGS copy number
/methods run which tools should I use for cfMeDIP and fragmentomics?
```

Npm CLI:

```bash
liquid-agent methods --input <dataset_or_subdir> --query "fragmentomics CNV methylation"
```

Write report files:

```bash
liquid-agent methods \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output-dir <output_dir>
```

Python script:

```bash
python scripts/run_liquid_biopsy_method_advisor.py \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output_dir <output_dir>
```

The advisor checks assay-specific methods, local dependency availability, method-specific resources, and internal fallback routes. It can be called with only a natural-language query when no dataset is active.

Useful focused queries:

```bash
liquid-agent methods --query "cfDNAPro FinaleToolkit LBFextract fragmentomics"
liquid-agent methods --query "WisecondorX HMMcopy low-pass CNV"
liquid-agent methods --query "FinaleMe cfTools cfSort methylation tissue of origin"
liquid-agent methods --query "MethylBERT CelFEER UXM MethAtlas cfNOMe MetDecode methylation deconvolution"
liquid-agent methods --query "CpGPT MethylGPT MethFormer methylation foundation model"
liquid-agent methods --query "PureCN FACETS BayesCNV CopywriteR targeted ctDNA CNV"
liquid-agent methods --query "cfDNAFE cfDNAanalyzer EMIT DeepFRAG fragmentomics"
```

## External Tool Runtime Manager

Use this layer when a recommended method has a registered non-kernel runtime and you want Liquid Agent to check, install, smoke-test, or call it through a stable wrapper.

Show all tools:

```bash
liquid-agent tools status
```

One-command setup:

```bash
liquid-agent tools bootstrap
liquid-agent tools bootstrap --execute
liquid-agent tools bootstrap --profile all --execute
```

Inspect one tool:

```bash
liquid-agent tools status --tool purecn
liquid-agent tools status --tool purecn --json
```

Install or prepare a runtime:

```bash
liquid-agent tools install purecn
liquid-agent tools install purecn --execute
```

Smoke-test a runtime:

```bash
liquid-agent tools smoke purecn
liquid-agent tools smoke facets
liquid-agent tools smoke dorado_modkit
```

Run a tool command through the wrapper:

```bash
liquid-agent tools run cnvkit -- cnvkit.py --help
liquid-agent tools run purecn -- Rscript -e "library(PureCN); packageVersion('PureCN')"
liquid-agent tools run dorado_modkit -- modkit --version
```

Run the internal CopywriteR-like compatibility proxy when the original legacy runtime is not suitable:

```bash
liquid-agent copywriter-proxy \
  --input <interval_or_bin_dir> \
  --output-dir <output_dir> \
  --exclude-regions <targets_or_peaks.bed>
```

This is a first-pass off-target/bin-count CNV screening route. It does not claim full equivalence to the original CopywriteR R/Bioconductor workflow.

Write tool status reports:

```bash
liquid-agent tools status --output-dir <output_dir>
```

`installed=True` means the runtime is callable. `ready=True` additionally means method-specific inputs, reference files, model checkpoints, and other real-analysis resources are configured. Legacy methods that cannot be installed cleanly, such as CopywriteR on macOS arm64, are marked as reimplementation candidates instead of being silently hidden.

Users should not manually activate external envs. Liquid Agent calls them internally through the wrapper layer.

## Command Cookbook

For script-first examples, see the repository-level `scripts/README.md` command cookbook.

## Default launch behaviour

`liquid-agent`, `liquid-agt` and `liq` without a subcommand open the local Web workspace. `liquid-agent cli` opens the terminal shell; `shell` remains a compatibility alias. `wiki` opens the public homepage and Docs. `--help` prints help without opening the browser.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# CLI 入口（中文）

## Npm 用户入口

Node 管理面向用户的命令行入口。从仓库检出目录安装本地命令包装器：

```bash
./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data"
```

等效终端形式：

```bash
./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data"
```

主要命令：

- `liquid-agent`
- `liq`
- `liquid-agt`
- `liquid-agent wiki`
- `liquid-agent cli` — 显式终端模式
- `liquid-agent shell`
- `liquid-agent portal`
- `liquid-agent web`
- `liquid-agent client`
- `liquid-agent llm-status`
- `liquid-agent llm-configure`
- `liquid-agent update --check` / `liquid-agent update` / `liquid-agent update --rollback`（macOS/Linux/Windows）
- `liquid-agent methods ...`
- `liquid-agent results <dataset_folder>`
- `liquid-agent skills ...`
- `liquid-agent demo-check`
- `liquid-agent assistant ...`
- `liquid-agent assistant plan <dataset_folder>`
- `liquid-agent assistant run <dataset_folder>`
- `liquid-agent blood-agent ...`

别名：

- `liquid-portal` 等效于 `liquid-agent portal`
- `liquid-web` 等效于 `liquid-agent web`
- `liquid-client` 等效于 `liquid-agent client`
- `liquidbiopsy-agent` 保留为旧示例的兼容别名

命令内部调用 Python 分析内核。Conda 安装时，安装程序记录当前激活的非 base 环境，以后使用 `conda run`，用户不必先激活环境。用 `LIQUID_AGENT_ENV=<env>` 选择其他 conda 环境，或用 `LIQUID_AGENT_PYTHON=/path/to/python` 直接指定 Python 内核。

以下 Python 模块/脚本命令仍可用于高级与可复现执行，但不再是首选交互用户界面。

终端 Shell 默认显示紧凑就绪面板。设置 `LIQUID_AGENT_STARTUP_VERBOSE=1`，可在启动时打印完整 Shell 状态和命令帮助。

## Web 界面

```bash
liquid-agent web
liquid-agent web --port 8771
liquid-agent web --no-open
liquid-web
liquid-agent portal
liquid-portal
liquid-agent client
liquid-agent client --port 8771
liquid-agent client --no-open
liquid-client
```

`liquid-agent web` 和 `liquid-agent client` 都直接在 `/#/agent` 打开本地 Web 工作台。使用 `liquid-agent wiki`（也可用 `liquid-agt wiki` 或 `liq wiki`）打开单独部署的公开主页和 Docs。在 CLI 交互模式输入 `wiki` 或 `/wiki` 也可打开主页，CLI 仍可继续使用。`liquid-agent portal` 保留为公开主页兼容入口。**Try it** 打开当前语言的安装文档，不会执行分析。

单次启动用 `--no-open` 仅打印 URL、不自动打开浏览器。如需当前终端会话每次浏览器启动都如此，设置 `LIQUID_AGENT_NO_OPEN=1`。

## 单次助手命令

```bash
liquid-agent assistant plan /path/to/dataset
liquid-agent assistant run /path/to/dataset
liquid-agent assistant --input /path/to/dataset --print-only
liquid-agent assistant --input /path/to/dataset --execute
```

`assistant plan` 是只规划不执行的友好别名。`assistant run` 规划并执行推荐的可行任务。显式 `--input` 形式仍供脚本和自动化使用。

## 元数据与标签控制

交互式 Shell 内：

```text
/metadata
/metadata use <table> <sample_col> <label_col>
/metadata ignore
/metadata rescan
```

命令读取当前数据集扫描概况，报告选定元数据表、样本 ID 列、标签列、标签计数、覆盖率、置信度、监督模式和建模后端。`use` 为当前会话覆盖自动选择。`ignore` 禁用标签感知规划，直到重新扫描元数据或重置会话。

同一元数据概况附加到 Web 扫描/计划响应，并在 Web Metadata 卡片汇总。

## 结果

```bash
liquid-agent results /path/to/dataset
liquid-agent results /path/to/dataset --limit 100
liquid-agent results /path/to/dataset --json
liquid-agent results /path/to/dataset --ask 1 --question "What should I do next?"
liquid-agent results /path/to/dataset --ask 1 --llm-provider none
```

`results` 列出数据集的 Liquid Agent 生成产物，包括报告、表格、JSON 汇总、静态图，以及 `analysis_concept_book.json` 等台账审计 JSON。外部 HTML/站点镜像被过滤，使列表聚焦智能体输出。`--ask <index>` 使用与交互式 Shell 相同的结果追问路径：LLM 可用时向其发送所选产物元数据和安全摘录；禁用或不可用时回退为本地产物上下文指导。

计划记录、运行记录、结果评估、概念簿等台账 JSON 会汇总为计划状态、任务执行/验证、QC/发现/后续，或待处理/已处理/受阻的结果驱动记忆，而非原样 JSON。自动运行 Markdown 报告也按停止原因、即时下一步、完成工作流、结果评估和台账状态汇总，不只返回原始摘录。本地回退根据产物类型建议安全下一步，例如继续结果评估中的推荐后续、运行计划里的就绪任务，或先修复记录的阻碍再重试失败运行。

计划记录追问汇总在存在时包含后端推荐审计，使 `results --ask` 可解释最低输出缺口、FeatureBook 平局决策或去重是否改变推荐任务。

## 专业 Skills

Npm CLI：

```bash
liquid-agent skills list
liquid-agent skills show <skill_id>
liquid-agent skills context "methylation QC encoder selection"
liquid-agent skills ingest <path_or_url> --title "Methylation Cohort Interpretation Notes"
liquid-agent skills remember "If the assay family is unclear, inspect raw signal summaries before choosing an encoder."
liquid-agent skills remember --memory-type personal --note "Show figures before long tables in demos."
liquid-agent skills preference "Show figures before long tables in demos."
liquid-agent skills root
```

交互式 Shell 内：

```text
/use <path> [path2 ...]
/sources
/sources add <path>
/sources remove <index|name|path>
/sources clear
/skills
/skills show <skill_id>
/skills ingest <path_or_url>
/skills remember <professional observation>
/skills preference <personal workflow preference>
/skills root
/skills refresh
/skills context <query>
/skills explain-plan
```

`/use <parent_folder>` 可自动检测多个液体活检子数据集。`/sources remove ...` 仅从当前任务解绑数据源，绝不删除源文件。

`/autopilot` 在 `assistant/ledger/` 下写入闭环记录：`plan_*.json`、`run_*.json` 和 `result_evaluation_*.json`。`/skills explain-plan` 显示哪些机器可读 skill 工作流影响当前计划。

安装可选 `skills` 依赖组后，`liquid-agent skills ingest` 接受本地文件、文件夹、URL 和 PDF。配置的 LLM 可用时用其提炼，没有 LLM 时回退到本地启发式 skill 写入器。

个人偏好可从 Shell 显式保存，也可在聊天中自然表达：

```text
/skills preference show plots first and keep the demo explanation concise.
Remember my preference: show plots first and keep the demo explanation concise.
```

这些笔记存于 `user-workflow-preferences`；专家或专业观察保留在 `professional-practice-notes`。

本地 Web 后端也提供：

- `GET /api/session/{session_id}/sources`
- `POST /api/session/{session_id}/sources`
- `DELETE /api/session/{session_id}/sources/{selector}`
- `DELETE /api/session/{session_id}/sources`
- `GET /api/skills`
- `GET /api/skills/{skill_id}`
- `POST /api/skills/refresh`
- `POST /api/session/{session_id}/skills/ingest`
- `POST /api/session/{session_id}/skills/remember`
- `GET /api/methods`
- `POST /api/session/{session_id}/methods/advice`

PDF 导入需要可选 `skills` 依赖组：

```bash
python -m pip install -e "[skills]"
```

## 预处理

- `python scripts/preprocess_epigenomic_signal.py`
- `python scripts/preprocess_lpwgs_signal.py`
- `python scripts/preprocess_variant_signal.py`

## 血液编码

- `python scripts/encode_cfdna_foundation_features.py`
- `python scripts/encode_epigenomic_signal_features.py`
- `python scripts/encode_lpwgs_features.py`
- `python scripts/encode_variant_features.py`

## cfDNA 下游

- `python scripts/run_cfdna_plot_suite.py`
- `python scripts/run_cfdna_analysis_suite.py`
- `python scripts/run_cfdna_raw_signal_suite.py`
- `python scripts/run_cfdna_raw_signal_analysis_suite.py`

标准 cfDNA 绘图 CLI 接受 `--projection {auto,umap,tsne,pca}`，默认 `auto`。

标准分析和绘图也可使用用户提供的已处理矩阵：

```bash
python scripts/run_cfdna_analysis_suite.py \
  --cnv_matrix_table <cnv_matrix.tsv[.gz]> \
  --output_dir <analysis_output_dir>

python scripts/run_cfdna_plot_suite.py \
  --methylation_matrix_table <methylation_matrix.tsv[.gz]> \
  --output_dir <visualisation_output_dir>
```

其他液体活检数值矩阵使用 `--signal_matrix_table`。默认通过 `--matrix_max_source_rows 50000` 有界读取大表，保持响应；设为 `0` 读取所有行。

## 液体活检方法顾问

交互式 Shell：

```text
/methods fragmentomics CNV methylation
/methods check low-pass cfDNA WGS copy number
/methods run which tools should I use for cfMeDIP and fragmentomics?
```

Npm CLI：

```bash
liquid-agent methods --input <dataset_or_subdir> --query "fragmentomics CNV methylation"
```

写入报告文件：

```bash
liquid-agent methods \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output-dir <output_dir>
```

Python 脚本：

```bash
python scripts/run_liquid_biopsy_method_advisor.py \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output_dir <output_dir>
```

顾问检查检测专用方法、本地依赖可用性、方法资源和内部回退路径。没有当前数据集时，也可仅以自然语言查询调用。

实用聚焦查询：

```bash
liquid-agent methods --query "cfDNAPro FinaleToolkit LBFextract fragmentomics"
liquid-agent methods --query "WisecondorX HMMcopy low-pass CNV"
liquid-agent methods --query "FinaleMe cfTools cfSort methylation tissue of origin"
liquid-agent methods --query "MethylBERT CelFEER UXM MethAtlas cfNOMe MetDecode methylation deconvolution"
liquid-agent methods --query "CpGPT MethylGPT MethFormer methylation foundation model"
liquid-agent methods --query "PureCN FACETS BayesCNV CopywriteR targeted ctDNA CNV"
liquid-agent methods --query "cfDNAFE cfDNAanalyzer EMIT DeepFRAG fragmentomics"
```

## 外部工具运行环境管理器

推荐方法具有注册的非内核运行环境，且希望 Liquid Agent 通过稳定包装器检查、安装、冒烟测试或调用时，使用此层。

显示所有工具：

```bash
liquid-agent tools status
```

一条命令安装准备：

```bash
liquid-agent tools bootstrap
liquid-agent tools bootstrap --execute
liquid-agent tools bootstrap --profile all --execute
```

检查单个工具：

```bash
liquid-agent tools status --tool purecn
liquid-agent tools status --tool purecn --json
```

安装或准备运行环境：

```bash
liquid-agent tools install purecn
liquid-agent tools install purecn --execute
```

运行环境冒烟测试：

```bash
liquid-agent tools smoke purecn
liquid-agent tools smoke facets
liquid-agent tools smoke dorado_modkit
```

通过包装器运行工具命令：

```bash
liquid-agent tools run cnvkit -- cnvkit.py --help
liquid-agent tools run purecn -- Rscript -e "library(PureCN); packageVersion('PureCN')"
liquid-agent tools run dorado_modkit -- modkit --version
```

原始既有运行环境不适合时，运行内部 CopywriteR 类兼容替代实现：

```bash
liquid-agent copywriter-proxy \
  --input <interval_or_bin_dir> \
  --output-dir <output_dir> \
  --exclude-regions <targets_or_peaks.bed>
```

这是首轮非靶向区域/分箱计数 CNV 筛查路径，不声称完全等效于原始 CopywriteR R/Bioconductor 工作流。

写入工具状态报告：

```bash
liquid-agent tools status --output-dir <output_dir>
```

`installed=True` 表示运行环境可调用。`ready=True` 还表示方法专用输入、参考文件、模型检查点和其他真实分析资源已配置。无法顺利安装的既有方法，例如 macOS arm64 环境中的 CopywriteR，会标记为重新实现候选，而不是静默隐藏。

用户不应手动激活外部环境。Liquid Agent 通过包装器层内部调用。

## 命令手册

脚本优先示例见仓库级 `scripts/README.md` 命令手册。

## 默认启动行为

不带子命令的 `liquid-agent`、`liquid-agt`、`liq` 默认打开本地 Web 交互界面。`liquid-agent cli` 进入终端，`shell` 保留为兼容别名；`wiki` 打开公开主页与 Docs。`--help` 仅打印帮助，不打开浏览器。
