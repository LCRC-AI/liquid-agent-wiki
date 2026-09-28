<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Metadata and Label-Aware Planning

Liquid Agent treats metadata and labels as part of dataset understanding, not
only as optional plot-colouring inputs. During scan, the assistant profiles
candidate metadata files, estimates whether labels are usable, and then chooses
an unsupervised, grouped, or exploratory supervised analysis route.

This is still exploratory research analysis. It does not produce diagnostic
claims.

## What Is Detected

The scanner looks for user-provided metadata and label tables in common formats:

- CSV and TSV
- Excel workbooks (`.xlsx`, `.xls`)
- Parquet
- JSON arrays
- JSON objects containing `samples`, `metadata`, `records`, `data`, or `rows`
- JSONL / NDJSON records

Generated output folders such as `analysis/`, `visualisation/`,
`visualization/`, `assistant/`, `preprocessed/`, `preprocessing/`, `features/`,
`models/`, and run-output folders are excluded from metadata detection so result
tables are not accidentally treated as user labels.

## Metadata Profile

Each scanned project receives a `metadata_profile` attached to the project
profile and exposed to Web scan/plan responses.

The profile records:

- candidate metadata tables
- selected metadata table
- sample identifier column
- selected label column
- label classes and counts
- labeled and matched sample counts
- sample coverage
- confidence
- supervision mode
- recommended modeling backend
- warnings and ambiguity notes

The selection priority is:

1. explicit user target or manual override
2. high sample coverage
3. common label names such as `condition`, `status`, `response`, `label`,
   `group`, `class`, `cancer`, or `control`
4. reasonable categorical class distribution

## Planning Modes

| Mode | Trigger | Planner behavior |
| --- | --- | --- |
| Unsupervised | no reliable classification label, one class after sample matching, or ignored metadata | QC, PCA/UMAP where applicable, outlier summaries, clustering-style summaries, raw-signal and matrix review |
| Grouped | labels exist but sample size or class balance is too small for model training | grouped summaries, group-coloured plots, feature/effect summaries, no classifier training |
| Supervised | labels have sufficient matched samples and at least two usable classes | grouped outputs plus exploratory supervised modeling |

Current automatic supervised threshold is intentionally conservative: at least
20 matched labeled samples, 2 to 5 classes, and at least 5 samples in the
smallest class.

## Modeling Backends

The default supervised backend is lightweight and deterministic:

- `sklearn_logistic_regression` with balanced class weights and stratified
  cross-validation when scikit-learn is available
- `pytorch_linear_probe` when PyTorch is available and the labeled sample count
  is at least 100

If neither backend is available, planning falls back to grouped analysis and the
report states why supervised modeling was skipped.

For high-dimensional raw matrices, the analysis layer prefers existing feature
stores or embeddings when available. Otherwise it uses conservative feature
selection/PCA-style preparation before training. Output reports mark all model
metrics as exploratory.

## CLI Control

Inside `liquid-agent`:

```text
/metadata
/metadata use <table> <sample_col> <label_col>
/metadata ignore
/metadata rescan
```

Use `/metadata` to inspect candidates and the current mode. Use
`/metadata use ...` when the automatic selection chose the wrong table or label.
Use `/metadata ignore` to force an unsupervised plan for the current session.
After changing metadata state, run `/plan` again.

Natural-language equivalents also work:

```text
Use metadata.csv and group samples by condition.
Ignore labels for this run and focus on unsupervised QC.
Use the response column for grouped plots and exploratory modeling.
```

## Web Client

The Web client shows a compact Metadata card under Sources:

- selected label or `no active label`
- coverage
- mode
- backend
- confidence
- Change / Ignore controls

The full table is not shown by default. The card is meant to explain the
planning decision without turning the sidebar into a spreadsheet viewer.

## Reports

Run reports include a **Metadata and Label Decision** section when metadata was
available or explicitly ignored. It states:

- which table and label column were used
- how many samples matched
- why the planner chose unsupervised, grouped, or supervised mode
- which modeling backend was selected or skipped
- which samples or labels were insufficient when relevant

This section is designed to make the analysis route auditable for collaborators
who were not present during the interactive session.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 元数据与标签感知规划（中文）

Liquid Agent 将元数据和标签视为理解数据集的一部分，而不只是可选的绘图着色输入。扫描期间，助手剖析候选元数据文件、评估标签是否可用，再选择无监督、分组或探索性监督分析路径。

这仍然是探索性研究分析，不产生诊断声明。

## 检测内容

扫描器查找用户提供的常见格式元数据和标签表：

- CSV 和 TSV
- Excel 工作簿（`.xlsx`、`.xls`）
- Parquet
- JSON 数组
- 包含 `samples`、`metadata`、`records`、`data` 或 `rows` 的 JSON 对象
- JSONL / NDJSON 记录

`analysis/`、`visualisation/`、`visualization/`、`assistant/`、`preprocessed/`、`preprocessing/`、`features/`、`models/` 及运行输出目录等生成文件夹会被排除在元数据检测之外，避免误将结果表格视为用户标签。

## 元数据概况

每个被扫描项目会获得附加到项目概况的 `metadata_profile`，并通过 Web 扫描/计划响应暴露。

概况记录：

- 候选元数据表
- 选定的元数据表
- 样本标识列
- 选定的标签列
- 标签类别与计数
- 带标签及匹配的样本计数
- 样本覆盖率
- 置信度
- 监督模式
- 推荐建模后端
- 警告和歧义说明

选择优先级为：

1. 显式用户目标或手动覆盖
2. 高样本覆盖率
3. `condition`、`status`、`response`、`label`、`group`、`class`、`cancer` 或 `control` 等常见标签名
4. 合理的类别分布

## 规划模式

| 模式 | 触发条件 | 规划器行为 |
| --- | --- | --- |
| 无监督 | 无可靠分类标签、样本匹配后只有一个类别，或已忽略元数据 | QC、适用时的 PCA/UMAP、离群值汇总、聚类类汇总、原始信号与矩阵审阅 |
| 分组 | 存在标签，但样本量或类别平衡不足以训练模型 | 分组汇总、按组着色图、特征/效应汇总，不训练分类器 |
| 监督 | 标签有足够的匹配样本，且至少两个可用类别 | 分组输出加探索性监督建模 |

当前自动监督阈值刻意保持保守：至少 20 个匹配的带标签样本、2–5 个类别，且最小类别至少 5 个样本。

## 建模后端

默认监督后端轻量且具有确定性：

- scikit-learn 可用时，采用带平衡类别权重和分层交叉验证的 `sklearn_logistic_regression`
- PyTorch 可用且带标签样本数至少 100 时，采用 `pytorch_linear_probe`

如果两个后端都不可用，规划回退到分组分析，报告说明跳过监督建模的原因。

对于高维原始矩阵，分析层优先使用可用的已有特征存储或嵌入。否则，在训练前采用保守特征选择/PCA 类准备。输出报告将所有模型指标标记为探索性。

## CLI 控制

在 `liquid-agent` 内：

```text
/metadata
/metadata use <table> <sample_col> <label_col>
/metadata ignore
/metadata rescan
```

使用 `/metadata` 查看候选和当前模式。自动选择了错误表格或标签时，使用 `/metadata use ...`。使用 `/metadata ignore` 强制当前会话采用无监督计划。改变元数据状态后，再次运行 `/plan`。

等效自然语言同样可用：

```text
Use metadata.csv and group samples by condition.
Ignore labels for this run and focus on unsupervised QC.
Use the response column for grouped plots and exploratory modeling.
```

## Web 客户端

Web 客户端在 Sources 下显示紧凑的 Metadata 卡片：

- 选定标签或 `no active label`
- 覆盖率
- 模式
- 后端
- 置信度
- Change / Ignore 控件

默认不显示完整表格。卡片旨在解释规划决策，而不是将侧边栏变成电子表格查看器。

## 报告

元数据可用或被显式忽略时，运行报告包含 **Metadata and Label Decision**（元数据与标签决策）章节，说明：

- 使用了哪个表格和标签列
- 匹配了多少样本
- 规划器为何选择无监督、分组或监督模式
- 选择或跳过了哪个建模后端
- 相关情况下，哪些样本或标签不足

该章节使未参与交互会话的合作者也能够审计分析路径。
