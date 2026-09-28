<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Python API

The package keeps Python-callable entrypoints alongside the npm user interface. Python is the analysis kernel and direct API; regular users should start from `liquid-agent`, `liquid-agent web`, or `liquid-agent client`.

For direct module use, execution is available as:

```bash
python -m liquidbiopsy_agent.cli <command>
```

The project no longer installs Python console scripts from `pyproject.toml`. Those names are owned by the npm package in `frontend/`.

## Top-Level Package Exports

From `src/liquidbiopsy_agent/__init__.py`, currently exported convenience functions include:

- `scan_project_profile(...)`
- `plan_assistant_tasks(...)`
- `summarize_project_outputs(...)`
- `run_liquidbiopsy_assistant(...)`
- `run_liquid_agent_shell(...)`
- `list_supported_blood_preprocessing_specs(...)`
- `plan_blood_preprocessing(...)`
- `preprocess_blood_signal_dataset(...)`
- `list_liquid_biopsy_methods(...)`
- `recommend_liquid_biopsy_methods(...)`
- `write_method_advice_report(...)`
- `list_feature_specs(...)`
- `compile_user_analysis_idea(...)`

## Preprocessing API

```python
from liquidbiopsy_agent.preprocessing import preprocess_blood_signal_dataset
```

Use this for epigenomic, LPWGS/ULPWGS, and variant preprocessing when you want to call the same preprocessing layer directly from Python.

## Assistant API

```python
from liquidbiopsy_agent.agent.assistant import (
    scan_project_profile,
    plan_assistant_tasks,
    execute_assistant_task,
    summarize_project_outputs,
)
```

Typical direct API flow:

```python
profile = scan_project_profile("<dataset_or_subdir>")
plan = plan_assistant_tasks(profile, goal="Run a first-pass liquid-biopsy analysis")
```

Plans include backend-only `data_state` and FeatureBook context when applicable.
The data state records visible signal families, input/output counts, metadata
coverage, blockers, and safe next actions. FeatureBook tracks which
liquid-biopsy signal contracts are relevant. Both are internal planning context;
regular users do not need to choose extra buttons or modes.

`scan_project_profile(...)` also attaches `profile.metadata_profile`. It records
candidate metadata tables, selected sample and label columns, label class
counts, matched sample coverage, confidence, supervision mode, backend, and
warnings. `plan_assistant_tasks(...)` consumes that profile to populate
`labels_table`, `labels_sample_col`, `labels_label_col`, `supervised_modeling`,
and `supervised_backend` task parameters when analysis inputs support them.

```python
from liquidbiopsy_agent import build_liquid_biopsy_data_state, compile_user_analysis_idea, list_feature_specs

data_state = build_liquid_biopsy_data_state(profile)
feature_specs = list_feature_specs()
idea = compile_user_analysis_idea(
    "Compare HER2 positive and negative methylation signals and make a figure.",
    profile,
)
```

FeatureBook entries describe expected artifacts, QC checks, interpretation
limits, and task sequences for fragmentomics, methylation, copy-number,
variant, signal-matrix, archive, and metadata/grouped-comparison contexts.

Closed-loop result evaluation can be called directly for custom evaluation or
report workflows:

```python
from liquidbiopsy_agent.agent.result_evaluator import evaluate_project_results
from liquidbiopsy_agent.agent.result_signals import extract_result_signals

evaluation = evaluate_project_results(profile)
data_state = evaluation["data_state"]
signals = evaluation["result_signals"]
concepts = evaluation["analysis_concepts"]
pending = evaluation["pending_analysis_concepts"]
actioned = evaluation["actioned_analysis_concepts"]
blocked = evaluation["blocked_analysis_concepts"]

from liquidbiopsy_agent.agent.ledger import PlanLedger

concept_memory = PlanLedger(profile.dataset_root).concept_memory()
```

`data_state` is the same backend summary persisted into plan ledger records and
autopilot reports. `analysis_concepts` are backend audit records that connect
parsed result signals to follow-up questions, candidate task families, QC
checks, interpretation limits, stable `novelty_key` values, and backend
`priority_score` values. They also include backend lifecycle fields such as
`lifecycle_stage`, `refined_task_sequence`, `required_outputs`, and
`verification_standard`. They are consumed by the planner and reports without
adding user-facing modes. `actioned_analysis_concepts` records which concepts
were covered by completed task families in the current run and carries
ToolCard-derived verification status when available, so downstream reports and
replans can avoid treating already-actioned follow-up questions as new work
without evidence. `pending_analysis_concepts` is the concept subset still
eligible for automatic task promotion and is marked as
`pending_execution`. `blocked_analysis_concepts` records concepts whose
candidate task families failed or produced incomplete ToolCard verification, so
the planner can avoid blind repeats and move to alternative ready work, method
advice, or an explicit blocker. The planner keeps actioned and blocked records
for audit but does not use them as pending concept-driven task promotions unless
new inputs, fresh result signals, verification gaps, or explicit user intent
change the evidence.
Result signals that would recreate the same actioned concept use the same
novelty key, so they cannot bypass concept-level dedupe and silently requeue
the same automatic follow-up. The same guard applies to blocked concepts: a raw
result signal cannot bypass a blocked concept novelty key and silently requeue a
failed task family.

When `evaluate_project_results(profile)` is called without an in-memory
`executed_runs` list, it also inspects the dataset's persisted
`assistant/ledger/run_*.json` records. This preserves concept action state after
restarting the shell or Web backend and prevents a new process from forgetting
that a matching task family already covered a follow-up concept.
`PlanLedger.concept_memory()` rolls up recent `result_evaluation_*.json`
records by concept novelty key and returns compact `pending`, `actioned`, and
`blocked` counts plus the latest concept rows. The planner can use this backend
memory when the newest evaluation is incomplete, without adding user-facing
controls or modes. The merge is safety-biased:
`generated < pending < blocked < actioned`, so a generic pending concept does
not erase a previous blocker, while a later verified action can supersede it.

`result_signals` are conservative follow-up clues extracted from generated
effect tables, grouped summaries, outlier tables, and summary JSON files. They
help the next plan and report reference actual outputs instead of repeating a
generic scan-only recommendation.

## Source Management API

```python
from liquidbiopsy_agent.agent.sources import (
    discover_dataset_sources,
    source_inventory_row,
    write_joint_source_inventory,
)
```

Use `discover_dataset_sources("<parent_or_dataset_folder>")` when a user-selected folder may contain multiple liquid-biopsy datasets. The returned source objects are session associations only; removing one from an agent task should not delete files. Joint autopilot writes source inventories with `source_id`, source path, likely signal, available assay summaries, labels, and generated output counts.

## Analysis API

Standard cfDNA:

```python
from liquidbiopsy_agent.analysis import run_cfdna_analysis_suite

summary = run_cfdna_analysis_suite(
    output_dir="<analysis_output_dir>",
    cfdna_features_dir="<feature_store_dir>",
)
```

Supplied CNV, methylation, EPIC-like, or generic liquid-biopsy signal matrices:

```python
from liquidbiopsy_agent.analysis import analyze_cfdna_signal_matrix, run_cfdna_analysis_suite

summary = run_cfdna_analysis_suite(
    output_dir="<analysis_output_dir>",
    cnv_matrix_table="<cnv_matrix.tsv.gz>",
    methylation_matrix_table="<methylation_matrix.tsv.gz>",
    matrix_max_features=1000,
)

matrix_summary = analyze_cfdna_signal_matrix(
    matrix_table="<matrix.tsv.gz>",
    output_dir="<analysis_output_dir>/matrix",
    signal_kind="methylation_matrix",
)
```

Raw-signal numeric:

```python
from liquidbiopsy_agent.analysis import run_cfdna_raw_signal_analysis_suite
```

## Visualization API

Standard cfDNA:

```python
from liquidbiopsy_agent.visualization import run_cfdna_plot_suite

summary = run_cfdna_plot_suite(
    output_dir="<visualization_output_dir>",
    cfdna_features_dir="<feature_store_dir>",
    projection="auto",
)
```

`run_cfdna_plot_suite(...)` accepts `projection="auto" | "umap" | "tsne" | "pca"`. The same visualization API accepts `cnv_matrix_table`, `methylation_matrix_table`, or `signal_matrix_table` and writes matrix heatmaps, projection CSVs, PNG figures, and optional Plotly HTML files when Plotly is installed. The current Web Results collector lists reports, tables, JSON, text, and static figures by default and filters HTML artifacts from the general result list.

Raw-signal visualization:

```python
from liquidbiopsy_agent.visualization import run_cfdna_raw_signal_suite
```

`run_cfdna_raw_signal_suite(...)` writes PNG and CSV artifacts and, when Plotly
is installed, may also generate HTML files for genome-wide profiles, sample/bin
heatmaps, and VAF distributions. The Web Results panel currently surfaces the
PNG/CSV/JSON/report outputs by default.

Internal compatibility proxy for legacy CopywriteR-like off-target/bin-count CNV screening:

```python
from liquidbiopsy_agent.analysis import run_copywriter_like_cnv_proxy

summary = run_copywriter_like_cnv_proxy(
    input_path="<interval_or_bin_dir>",
    output_dir="<output_dir>",
    exclude_regions="<targets_or_peaks.bed>",
)
```

## Method Advisor API

```python
from liquidbiopsy_agent.methods import (
    bootstrap_external_tools,
    external_tool_status,
    install_external_tool,
    list_liquid_biopsy_methods,
    recommend_liquid_biopsy_methods,
    run_external_tool_command,
    smoke_external_tool,
    write_method_advice_report,
    write_external_tool_status_report,
)
```

Use this layer to compare liquid-biopsy methods and tools against a dataset path or a natural-language question:

```python
advice = recommend_liquid_biopsy_methods(
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
```

Focused method queries work the same way:

```python
recommend_liquid_biopsy_methods(query="cfDNAPro FinaleToolkit LBFextract fragmentomics")
recommend_liquid_biopsy_methods(query="WisecondorX HMMcopy low-pass CNV")
recommend_liquid_biopsy_methods(query="FinaleMe cfTools cfSort methylation tissue of origin")
recommend_liquid_biopsy_methods(query="MethylBERT CelFEER UXM MethAtlas cfNOMe MetDecode methylation deconvolution")
recommend_liquid_biopsy_methods(query="CpGPT MethylGPT MethFormer methylation foundation model")
recommend_liquid_biopsy_methods(query="PureCN FACETS BayesCNV CopywriteR targeted ctDNA CNV")
recommend_liquid_biopsy_methods(query="cfDNAFE cfDNAanalyzer EMIT DeepFRAG fragmentomics")
```

Write JSON and Markdown reports:

```python
summary = write_method_advice_report(
    output_dir="<output_dir>",
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
```

External tool runtime helpers:

```python
status = external_tool_status("purecn")
bootstrap_plan = bootstrap_external_tools(profile="core", execute=False)
install_plan = install_external_tool("purecn", execute=False)
smoke = smoke_external_tool("purecn")
result = run_external_tool_command("cnvkit", ("cnvkit.py", "--help"))
report = write_external_tool_status_report("<output_dir>")
```

## Skill API

```python
from liquidbiopsy_agent.agent.skills import (
    list_skill_documents,
    ingest_skill_source,
    remember_professional_observation,
    remember_user_preference,
    get_skill_context,
    refresh_skill_cache,
)
```

Use this layer for paper ingestion, expert notes, private user preference memory,
local skill cache refresh, and skill-context retrieval.

Compatibility aliases `list_skills` and `remember_expert_note` remain available
for older local scripts, but new code should use `list_skill_documents`,
`remember_professional_observation`, and `remember_user_preference`.

## Web Backend API

The local service lives under `src/liquidbiopsy_agent/web/` and exposes session,
chat, source, planning, task, artifact, skill, method, LLM, upload, and job
endpoints. It calls the same assistant, autopilot, method-advisor, result
browser, and skill logic used by the terminal shell.

The closed-loop agent layer also exposes durable plan and result state under
each conversation-owned source workspace's `assistant/ledger/` folder (standalone
analysis commands use their explicit output root). The main Python helpers are:

```python
from liquidbiopsy_agent.agent.ledger import PlanLedger
from liquidbiopsy_agent.agent.result_evaluator import evaluate_project_results

profile = scan_project_profile("<dataset_or_subdir>")
plan = plan_assistant_tasks(profile)
ledger = PlanLedger(profile.dataset_root)
plan_record = ledger.write_plan(plan, profile)
evaluation = ledger.write_evaluation(evaluate_project_results(profile))
```

These helpers are used by the terminal shell and Web autopilot. They are safe to
read directly when building dashboards or external audit tools.
`PlanLedger.concept_memory()` returns the compact pending/actioned/blocked
follow-up memory used by the planner, reports, and final immediate-next-action
generation.
`PlanLedger.write_evaluation(...)` refreshes that book automatically after each
saved evaluation; `PlanLedger.write_concept_book()` can also refresh it
explicitly for backend audit tools and result-driven replanning.
Plan records written after a result evaluation include the concept book path and
a compact concept-memory snapshot, so external audit tools can explain why a
next plan continued, paused, or avoided a repeated follow-up.
The `plan_novelty.concept_memory_delta` field compares the previous and current
snapshots for count changes and concept lifecycle transitions.
`PlanLedger.summary()` carries this compact novelty block in recent plan
history so reports and external audit tools can show the explanation without
loading full plan JSON files.

Main endpoint groups:

- Session and LLM: `POST /api/session`, `GET/PATCH /api/session/{session_id}`, `GET/POST /api/llm/config`, `DELETE /api/llm/config/{provider}`
- Reviewed local-model library: `GET /api/llm/local/catalog`, `POST /api/llm/local/catalog/{identifier}/install|pause|resume|acknowledge`, `DELETE /api/llm/local/catalog/{identifier}/download`; profile CRUD/probes remain under `/api/llm/local`
- Dataset and source management: `POST /api/session/{session_id}/dataset`, `GET/POST /api/session/{session_id}/sources`, `DELETE /api/session/{session_id}/sources/{selector}`, `DELETE /api/session/{session_id}/sources`
- Scan and planning: `POST /api/session/{session_id}/scan?include_plan=0|1`, `POST /api/session/{session_id}/plan`, `POST /api/session/{session_id}/message`
- Method and tools: `GET /api/methods`, `POST /api/session/{session_id}/methods/advice`, `GET /api/tools`, `GET /api/tools/{tool_key}`
- Skills and uploads: `GET /api/skills`, `GET /api/skills/{skill_id}`, `POST /api/skills/refresh`, `POST /api/session/{session_id}/skills/ingest`, `POST /api/session/{session_id}/skills/remember`, `POST /api/session/{session_id}/uploads`
- Runs and jobs: `POST /api/session/{session_id}/autopilot`, `POST /api/session/{session_id}/tasks/{task_key}/run`, `GET /api/jobs/{job_id}`, `GET /api/jobs/{job_id}/events`, `POST /api/jobs/{job_id}/cancel`
- Results and artifacts: `GET/DELETE /api/session/{session_id}/results`, `GET /api/session/{session_id}/file`, `GET /api/session/{session_id}/artifact`
- Local page lifecycle: `/api/system/health`, `/api/system/page-open`, `/api/system/heartbeat`, `/api/system/page-close`, `/api/system/page-close-mode`, `/api/system/page-watch`, `/api/system/force-shutdown`

`include_plan=0` lets the Web source drawer attach and scan a folder quickly
without immediately building a runnable plan. The Plan button, `/plan`, or a
planning-oriented message can request the full plan after the source is known.
Plan responses include the current `plan_id`, `ledger_path`, matched
`skills_used`, and a compact ledger summary when a runnable plan is generated.
Autopilot job events can include `run_recorded`, `result_evaluated`,
`workflow_replanned`, and `workflow_completed` payloads.

## Workspace continuity and current contracts

The running service exposes its complete generated schema at `/api/docs` and `/openapi.json`; `/docs/` is the bilingual user guide. Use that schema for request/response models rather than copying historical payloads.

- Task lifecycle: `POST /api/conversations/status`, `GET /api/conversations/trash`, `POST /api/conversations/trash`, `POST /api/conversations/{thread_id}/restore`, `DELETE /api/conversations/{thread_id}/purge`, and `GET /api/activity`.
- Scientific jobs and multi-turn requests retain the shared session/job contracts above. Linking and memory use registered conversation tools and task-owned storage; they do not introduce arbitrary filesystem access.
- For model profile CRUD/probes, images, skill reviews and linked preparation, inspect the current OpenAPI paths and the shared tool schemas in `agent/llm.py`. Context snapshots and result references remain subject to privacy and ownership checks.

See [current capabilities](capability-matrix.md), [task memory](../guides/linked-tasks-and-memory.md) and [local model profiles](../guides/local-models.md) for user-facing contracts.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# Python API（中文）

该包在 npm 用户界面之外保留 Python 可调用入口。Python 是分析内核和直接调用 API；普通用户应从 `liquid-agent`、`liquid-agent web` 或 `liquid-agent client` 开始。

需要直接调用模块时，可使用：

```bash
python -m liquidbiopsy_agent.cli <command>
```

项目不再通过 `pyproject.toml` 安装 Python 控制台脚本。这些名称由 `frontend/` 中的 npm 包管理。

## 顶层包导出

`src/liquidbiopsy_agent/__init__.py` 当前导出的便利函数包括：

- `scan_project_profile(...)`
- `plan_assistant_tasks(...)`
- `summarize_project_outputs(...)`
- `run_liquidbiopsy_assistant(...)`
- `run_liquid_agent_shell(...)`
- `list_supported_blood_preprocessing_specs(...)`
- `plan_blood_preprocessing(...)`
- `preprocess_blood_signal_dataset(...)`
- `list_liquid_biopsy_methods(...)`
- `recommend_liquid_biopsy_methods(...)`
- `write_method_advice_report(...)`
- `list_feature_specs(...)`
- `compile_user_analysis_idea(...)`

## 预处理 API

```python
from liquidbiopsy_agent.preprocessing import preprocess_blood_signal_dataset
```

需要从 Python 直接调用同一预处理层时，用于表观基因组、LPWGS/ULPWGS 和变异预处理。

## 助手 API

```python
from liquidbiopsy_agent.agent.assistant import (
    scan_project_profile,
    plan_assistant_tasks,
    execute_assistant_task,
    summarize_project_outputs,
)
```

典型直接调用流程：

```python
profile = scan_project_profile("<dataset_or_subdir>")
plan = plan_assistant_tasks(profile, goal="Run a first-pass liquid-biopsy analysis")
```

适用时，计划包含仅后端使用的 `data_state` 和 FeatureBook 上下文。数据状态记录可见信号家族、输入/输出计数、元数据覆盖率、阻碍和安全下一步。FeatureBook 跟踪相关液体活检信号契约。两者都是内部规划上下文，普通用户无需选择额外按钮或模式。

`scan_project_profile(...)` 也附加 `profile.metadata_profile`，记录候选元数据表、选定样本和标签列、类别计数、匹配样本覆盖率、置信度、监督模式、后端及警告。分析输入支持时，`plan_assistant_tasks(...)` 使用该概况填充 `labels_table`、`labels_sample_col`、`labels_label_col`、`supervised_modeling` 和 `supervised_backend` 任务参数。

```python
from liquidbiopsy_agent import build_liquid_biopsy_data_state, compile_user_analysis_idea, list_feature_specs

data_state = build_liquid_biopsy_data_state(profile)
feature_specs = list_feature_specs()
idea = compile_user_analysis_idea(
    "Compare HER2 positive and negative methylation signals and make a figure.",
    profile,
)
```

FeatureBook 条目描述片段组学、甲基化、拷贝数、变异、信号矩阵、归档和元数据/分组比较上下文的预期产物、QC 检查、解释限制和任务顺序。

自定义结果评估或报告流程可直接调用闭环结果评估：

```python
from liquidbiopsy_agent.agent.result_evaluator import evaluate_project_results
from liquidbiopsy_agent.agent.result_signals import extract_result_signals

evaluation = evaluate_project_results(profile)
data_state = evaluation["data_state"]
signals = evaluation["result_signals"]
concepts = evaluation["analysis_concepts"]
pending = evaluation["pending_analysis_concepts"]
actioned = evaluation["actioned_analysis_concepts"]
blocked = evaluation["blocked_analysis_concepts"]

from liquidbiopsy_agent.agent.ledger import PlanLedger

concept_memory = PlanLedger(profile.dataset_root).concept_memory()
```

`data_state` 与持久保存到计划台账和自动运行报告的后端摘要相同。`analysis_concepts` 是后端审计记录，将解析后的结果信号连接到后续问题、候选任务家族、QC 检查、解释限制、稳定 `novelty_key` 和后端 `priority_score`，也包含 `lifecycle_stage`、`refined_task_sequence`、`required_outputs` 和 `verification_standard` 等后端生命周期字段。规划器和报告使用它们，不增加用户模式。`actioned_analysis_concepts` 记录当前运行中已完成任务家族覆盖的概念，并在可用时携带 ToolCard 验证状态，使下游报告和重新规划避免无证据地把已处理后续问题当成新工作。`pending_analysis_concepts` 是仍可自动提升为任务的概念子集，标记为 `pending_execution`。`blocked_analysis_concepts` 记录候选任务家族失败或 ToolCard 验证不完整的概念，使规划器避免盲目重复，转向其他就绪工作、方法建议或显式阻碍。规划器保留已处理和受阻记录供审计，但除非新输入、新结果信号、验证缺口或明确用户意图改变证据，否则不将其作为待处理概念驱动的任务提升。

会重建同一已处理概念的结果信号使用相同新颖性键，因此不能绕过概念级去重，静默重新排入相同自动后续任务。受阻概念采用同样防护：原始结果信号不能绕过受阻概念新颖性键，静默重新排入失败任务家族。

调用 `evaluate_project_results(profile)` 时若没有内存中的 `executed_runs` 列表，还会检查数据集已持久化的 `assistant/ledger/run_*.json` 记录。这在 Shell 或 Web 后端重启后保留概念操作状态，防止新进程忘记已有匹配任务家族覆盖后续概念。`PlanLedger.concept_memory()` 按概念新颖性键汇总近期 `result_evaluation_*.json`，返回精简的 `pending`、`actioned`、`blocked` 计数及最新概念行。最新评估不完整时，规划器可使用此后端记忆，无需增加用户控件或模式。合并采用安全偏向：`generated < pending < blocked < actioned`，因此通用待处理概念不抹去之前阻碍，后续验证过的操作则可取代它。

`result_signals` 是从生成效应表、分组汇总、离群值表和汇总 JSON 中提取的保守后续线索，帮助下一份计划和报告引用实际输出，而非重复只基于扫描的通用建议。

## 数据源管理 API

```python
from liquidbiopsy_agent.agent.sources import (
    discover_dataset_sources,
    source_inventory_row,
    write_joint_source_inventory,
)
```

当用户选定文件夹可能包含多个液体活检数据集时，使用 `discover_dataset_sources("<parent_or_dataset_folder>")`。返回的源对象仅是会话关联，从智能体任务移除它不应删除文件。联合自动运行写入数据源清单，包含 `source_id`、源路径、可能信号、可用检测汇总、标签和生成输出计数。

## 分析 API

标准 cfDNA：

```python
from liquidbiopsy_agent.analysis import run_cfdna_analysis_suite

summary = run_cfdna_analysis_suite(
    output_dir="<analysis_output_dir>",
    cfdna_features_dir="<feature_store_dir>",
)
```

用户提供的 CNV、甲基化、EPIC 类或通用液体活检信号矩阵：

```python
from liquidbiopsy_agent.analysis import analyze_cfdna_signal_matrix, run_cfdna_analysis_suite

summary = run_cfdna_analysis_suite(
    output_dir="<analysis_output_dir>",
    cnv_matrix_table="<cnv_matrix.tsv.gz>",
    methylation_matrix_table="<methylation_matrix.tsv.gz>",
    matrix_max_features=1000,
)

matrix_summary = analyze_cfdna_signal_matrix(
    matrix_table="<matrix.tsv.gz>",
    output_dir="<analysis_output_dir>/matrix",
    signal_kind="methylation_matrix",
)
```

原始信号数值分析：

```python
from liquidbiopsy_agent.analysis import run_cfdna_raw_signal_analysis_suite
```

## 可视化 API

标准 cfDNA：

```python
from liquidbiopsy_agent.visualization import run_cfdna_plot_suite

summary = run_cfdna_plot_suite(
    output_dir="<visualization_output_dir>",
    cfdna_features_dir="<feature_store_dir>",
    projection="auto",
)
```

`run_cfdna_plot_suite(...)` 接受 `projection="auto" | "umap" | "tsne" | "pca"`。同一可视化 API 接受 `cnv_matrix_table`、`methylation_matrix_table` 或 `signal_matrix_table`，写入矩阵热图、投影 CSV、PNG 图，并在安装 Plotly 时可选写入 HTML。当前 Web Results 收集器默认列出报告、表格、JSON、文本和静态图，从通用结果列表过滤 HTML 产物。

原始信号可视化：

```python
from liquidbiopsy_agent.visualization import run_cfdna_raw_signal_suite
```

`run_cfdna_raw_signal_suite(...)` 写入 PNG 和 CSV，安装 Plotly 后也可能为全基因组概览、样本/分箱热图和 VAF 分布生成 HTML。Web Results 当前默认展示 PNG/CSV/JSON/报告输出。

用于既有 CopywriteR 类非靶向区域/分箱计数 CNV 筛查的内部兼容替代实现：

```python
from liquidbiopsy_agent.analysis import run_copywriter_like_cnv_proxy

summary = run_copywriter_like_cnv_proxy(
    input_path="<interval_or_bin_dir>",
    output_dir="<output_dir>",
    exclude_regions="<targets_or_peaks.bed>",
)
```

## 方法顾问 API

```python
from liquidbiopsy_agent.methods import (
    bootstrap_external_tools,
    external_tool_status,
    install_external_tool,
    list_liquid_biopsy_methods,
    recommend_liquid_biopsy_methods,
    run_external_tool_command,
    smoke_external_tool,
    write_method_advice_report,
    write_external_tool_status_report,
)
```

使用此层针对数据集路径或自然语言问题比较液体活检方法与工具：

```python
advice = recommend_liquid_biopsy_methods(
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
```

聚焦方法查询采用同样方式：

```python
recommend_liquid_biopsy_methods(query="cfDNAPro FinaleToolkit LBFextract fragmentomics")
recommend_liquid_biopsy_methods(query="WisecondorX HMMcopy low-pass CNV")
recommend_liquid_biopsy_methods(query="FinaleMe cfTools cfSort methylation tissue of origin")
recommend_liquid_biopsy_methods(query="MethylBERT CelFEER UXM MethAtlas cfNOMe MetDecode methylation deconvolution")
recommend_liquid_biopsy_methods(query="CpGPT MethylGPT MethFormer methylation foundation model")
recommend_liquid_biopsy_methods(query="PureCN FACETS BayesCNV CopywriteR targeted ctDNA CNV")
recommend_liquid_biopsy_methods(query="cfDNAFE cfDNAanalyzer EMIT DeepFRAG fragmentomics")
```

写入 JSON 与 Markdown 报告：

```python
summary = write_method_advice_report(
    output_dir="<output_dir>",
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
```

外部工具运行环境辅助函数：

```python
status = external_tool_status("purecn")
bootstrap_plan = bootstrap_external_tools(profile="core", execute=False)
install_plan = install_external_tool("purecn", execute=False)
smoke = smoke_external_tool("purecn")
result = run_external_tool_command("cnvkit", ("cnvkit.py", "--help"))
report = write_external_tool_status_report("<output_dir>")
```

## Skill API

```python
from liquidbiopsy_agent.agent.skills import (
    list_skill_documents,
    ingest_skill_source,
    remember_professional_observation,
    remember_user_preference,
    get_skill_context,
    refresh_skill_cache,
)
```

此层用于论文导入、专家笔记、用户私有偏好记忆、本地 skill 缓存刷新和 skill 上下文检索。

为旧本地脚本保留兼容别名 `list_skills` 与 `remember_expert_note`；新代码应使用 `list_skill_documents`、`remember_professional_observation` 和 `remember_user_preference`。

## Web 后端 API

本地服务位于 `src/liquidbiopsy_agent/web/`，提供会话、聊天、数据源、规划、任务、产物、skill、方法、LLM、上传和任务作业端点，调用与终端 Shell 相同的助手、自动运行、方法顾问、结果浏览器和 skill 逻辑。

闭环智能体层也在每个对话自有数据源工作区的 `assistant/ledger/` 文件夹下暴露持久计划和结果状态（独立分析命令使用显式输出根目录）。主要 Python 辅助函数：

```python
from liquidbiopsy_agent.agent.ledger import PlanLedger
from liquidbiopsy_agent.agent.result_evaluator import evaluate_project_results

profile = scan_project_profile("<dataset_or_subdir>")
plan = plan_assistant_tasks(profile)
ledger = PlanLedger(profile.dataset_root)
plan_record = ledger.write_plan(plan, profile)
evaluation = ledger.write_evaluation(evaluate_project_results(profile))
```

终端 Shell 和 Web 自动运行均使用这些辅助函数。构建仪表盘或外部审计工具时可安全直接读取。`PlanLedger.concept_memory()` 返回规划器、报告和最终即时下一步生成使用的精简待处理/已处理/受阻后续记忆。`PlanLedger.write_evaluation(...)` 在每次保存评估后自动刷新该概念簿；`PlanLedger.write_concept_book()` 也可为后端审计工具和结果驱动重新规划显式刷新。

结果评估后写入的计划记录包含概念簿路径和精简概念记忆快照，让外部审计工具解释下一份计划为何继续、暂停或避免重复后续任务。`plan_novelty.concept_memory_delta` 比较前后快照中的计数变化和概念生命周期迁移。`PlanLedger.summary()` 在近期计划历史中携带此精简新颖性区块，让报告和外部审计工具无需加载完整计划 JSON 即可展示解释。

主要端点组：

- 会话与 LLM：`POST /api/session`、`GET/PATCH /api/session/{session_id}`、`GET/POST /api/llm/config`、`DELETE /api/llm/config/{provider}`
- 审核本地模型库：`GET /api/llm/local/catalog`、`POST /api/llm/local/catalog/{identifier}/install|pause|resume|acknowledge`、`DELETE /api/llm/local/catalog/{identifier}/download`；profile 增删改和探测仍位于 `/api/llm/local`
- 数据集与数据源管理：`POST /api/session/{session_id}/dataset`、`GET/POST /api/session/{session_id}/sources`、`DELETE /api/session/{session_id}/sources/{selector}`、`DELETE /api/session/{session_id}/sources`
- 扫描与规划：`POST /api/session/{session_id}/scan?include_plan=0|1`、`POST /api/session/{session_id}/plan`、`POST /api/session/{session_id}/message`
- 方法与工具：`GET /api/methods`、`POST /api/session/{session_id}/methods/advice`、`GET /api/tools`、`GET /api/tools/{tool_key}`
- Skills 与上传：`GET /api/skills`、`GET /api/skills/{skill_id}`、`POST /api/skills/refresh`、`POST /api/session/{session_id}/skills/ingest`、`POST /api/session/{session_id}/skills/remember`、`POST /api/session/{session_id}/uploads`
- 运行与任务：`POST /api/session/{session_id}/autopilot`、`POST /api/session/{session_id}/tasks/{task_key}/run`、`GET /api/jobs/{job_id}`、`GET /api/jobs/{job_id}/events`、`POST /api/jobs/{job_id}/cancel`
- 结果与产物：`GET/DELETE /api/session/{session_id}/results`、`GET /api/session/{session_id}/file`、`GET /api/session/{session_id}/artifact`
- 本地页面生命周期：`/api/system/health`、`/api/system/page-open`、`/api/system/heartbeat`、`/api/system/page-close`、`/api/system/page-close-mode`、`/api/system/page-watch`、`/api/system/force-shutdown`

`include_plan=0` 让 Web 数据源抽屉快速添加并扫描文件夹，而不立即构建可运行计划。数据源明确后，Plan 按钮、`/plan` 或规划类消息可请求完整计划。生成可运行计划时，响应包含当前 `plan_id`、`ledger_path`、匹配的 `skills_used` 和精简台账摘要。自动运行任务事件可包含 `run_recorded`、`result_evaluated`、`workflow_replanned` 和 `workflow_completed` 载荷。

## 工作区连续性与当前接口

运行中的服务在 `/api/docs` 和 `/openapi.json` 提供完整生成式接口说明；`/docs/` 是双语用户文档。请求／响应结构以当前 schema 为准，不复制过时的载荷示例。

- 任务生命周期：`POST /api/conversations/status`、`GET /api/conversations/trash`、`POST /api/conversations/trash`、`POST /api/conversations/{thread_id}/restore`、`DELETE /api/conversations/{thread_id}/purge`、`GET /api/activity`。
- 科学任务和多轮请求继续使用上述 session/job 接口；链接和记忆通过已注册对话工具与任务专属存储工作，不引入任意文件系统访问。
- 本地模型配置管理／探测、图像、技能审阅与链接准备，请查看当前 OpenAPI 路径以及 `agent/llm.py` 的共享工具定义。上下文快照和结果引用继续进行隐私及归属检查。

用户层面的约定见[当前功能](capability-matrix.md)、[任务记忆](../guides/linked-tasks-and-memory.md)和[本地模型配置](../guides/local-models.md)。
