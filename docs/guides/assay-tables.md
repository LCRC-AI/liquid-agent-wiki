<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Explicit Assay Tables

An assay contract makes units and measurement semantics explicit before a local
analysis. It does not turn the agent into a fixed workflow. QC and differential
expression are separate capabilities: the user can inspect, discuss, run, stop,
redirect or decline either one. Web and CLI use the same analysis implementation.

## Supported Operations

| Declared assay | Value kinds | Computation |
| --- | --- | --- |
| Digital PCR | `partitions` | Poisson-occupancy concentration, exact-binomial transformed 95% intervals, zero/saturation QC |
| Circulating tumour cells | `cell_counts` | Counts per mL, exact Poisson 95% intervals |
| Cell-free RNA, small RNA | `raw_counts`, `abundance`, `log_abundance` | Sample/feature QC, missingness, distributions, variable-feature profiles, exploratory PCA |
| Plasma proteins, metabolites | `abundance`, `log_abundance` | The same processed-matrix QC with declared units; no count-model substitution |
| EV cargo | `raw_counts`, `abundance`, `log_abundance` | Molecular-table QC, not proof of EV purity or origin |
| CTC molecular profiles | `raw_counts` | Count-matrix QC, distinct from enumeration |
| Methylation arrays | `beta` | Beta-table QC; no raw IDAT normalization or DMR claim |
| Declared independent-group RNA count contrast | `raw_counts` only | PyDESeq2 negative-binomial fitting, Wald tests and adjusted p-values |

Install optional scientific dependencies in the environment used to launch the
agent:

```bash
python -m pip install -e '.[assay-tables]'
```

The supported PyDESeq2 0.5.4 requires NumPy 2 and is
not compatible with the legacy optional `blood-models` dependency set's NumPy
constraint. Do not force an incompatible combined environment; those legacy
encoder runtimes need separate dependency resolution. The normal agent can
inspect prerequisites without installing all optional model runtimes.

## A Source Contract

Put a small JSON file ending in `.assay.json` beside its input tables. For example:

```json
{
  "version": 1,
  "assay": "cell-free-rna",
  "table": "counts.csv",
  "value_kind": "raw_counts",
  "units": "reads",
  "metadata": "metadata.csv",
  "group_column": "condition",
  "contrast": ["case", "control"],
  "independent_samples": true,
  "synthetic": false
}
```

Matrix tables are CSV or TSV with a unique `feature_id` first column followed by
unique sample columns. Metadata has unique `sample_id` values and the declared
group column. No groups are inferred from filenames or sample names.

```text
feature_id,S01,S02,S03,S04,S05,S06
GENE_A,12,18,14,42,38,45
GENE_B,31,29,34,27,30,32
```

This tiny schema example is not large enough for dispersion fitting. The
differential wrapper requires at least ten features with total count >= 10,
exactly two declared groups, at least three independent samples per group and
exact metadata/sample matching. Paired, patient, batch or time covariates require
a reviewed multifactor workflow and are rejected by this single-factor wrapper.
Those checks are minimum technical gates, not a power calculation.

Omit `contrast`, `metadata` and `independent_samples` for an unlabelled QC-only
source. Missing values in abundance/beta tables stay missing. Missing raw counts,
negative counts, fractional counts, invalid beta values and duplicate IDs are
rejected rather than silently repaired. Relative input paths must stay inside
the manifest folder; symlink escapes are rejected.

## Digital PCR and CTC Schemas

Digital PCR uses `assay: digital-pcr` and `value_kind: partitions`. Its table needs:

```text
sample_id,target,positive_partitions,total_partitions,partition_volume_nl,dilution_factor
S01,TARGET_A,120,18000,0.85,1
S02,TARGET_A,0,18000,0.85,2
```

Counts refer to the **accepted partitions** after upstream gating. Concentration
is `-ln(1 - positive/total) * 1000 / partition_volume_nl * dilution_factor`, in
copies per microlitre of the input before that dilution. Plasma-volume conversion
requires further explicit extraction/recovery information and is not inferred.
Zero positives retains a positive upper uncertainty bound. Fully positive wells
are saturated; the report marks their point estimate and upper bound unbounded,
not zero. Replicate aggregation, blank/detection thresholds and variant duplex
cross-talk fitting are not supplied by this count wrapper.

CTC enumeration uses `assay: circulating-tumour-cells`, `value_kind: cell_counts`:

```text
sample_id,cell_count,volume_ml
S01,10,7.5
S02,0,7.5
```

Cell identity and accepted counting criteria must already be established. The
engine does not estimate enrichment efficiency or assign a clinical threshold.

## Use From Web or CLI

Attach the source folder normally. Ask the LLM to inspect its assay contract,
then request a focused plan or authorize the desired operation. `inspect_workspace`
exposes distinct QC and contrast task IDs; a question alone runs neither.

If no contract exists, you can supply the same details in natural language:

> This CSV contains accepted digital-PCR partitions. Its columns are sample_id,
> target, positive_partitions, total_partitions, partition_volume_nl and
> dilution_factor. Configure it for occupancy quantification in copies/uL input.
> Do not run the analysis yet.

The `configure_assay` tool validates a structured declaration and copies only the
declared inputs into this conversation's workspace. It does not write into the
original source or run the analysis. The model must ask about unknown assay,
units or experimental-design details rather than guess. Configuration is not
evidence that upstream gating, sample identity or clinical validation is correct.

For a deterministic, reproducible CLI operation without an LLM:

```bash
liquid-agent assay /path/to/source/input.assay.json --output /path/to/new/qc-run
liquid-agent assay /path/to/source/input.assay.json --output /path/to/new/contrast-run --differential
```

The second command is an explicit contrast request. The first never runs the
contrast merely because it is present in the manifest.

## Outputs and Interpretation

Each completed run publishes a Markdown report, real PNG figures, full CSV
measurements/QC tables and input hashes. The report embeds figure links and a
bounded table preview. Original tables are never overwritten. Existing output
directories are rejected; cancelled or failed runs do not publish a completed
report. Agent runs live in conversation-owned workspaces and follow the same
Trash/restore/purge rules as other results.

Distribution plots show at most 30 samples; heatmaps show at most 40 variable
features. Full CSVs preserve all supplied measurements. PCA uses up to 2,000
complete, variable features across all samples and reports that bound; incomplete
and constant features are excluded rather than replaced by invented zeros. Count QC uses log2(CPM+1)
for display; PyDESeq2 receives the unnormalized integer counts, not those plots.
Model-fitting warnings and non-estimable tests are retained in the scientific
limitations and a diagnostic record. Differential reports show effects and
adjusted p-values, not only sample QC. Technical provenance stays in audit files,
not in the report's default scientific table section.

Reports must distinguish exploratory findings from evidence of clinical utility.
Processed-table support is not a claim of end-to-end alignment, protein
identification, metabolite identification or real-cohort validation.

## Reused Scientific Methods

The implementation calls maintained libraries rather than recreating a count
model: [PyDESeq2](https://github.com/scverse/PyDESeq2) and its
[documented workflow](https://pydeseq2.readthedocs.io/en/stable/auto_examples/plot_minimal_pydeseq2_pipeline.html),
[statsmodels binomial intervals](https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html),
and SciPy's inverse chi-square distribution for exact Poisson intervals. Input contracts,
ownership, cancellation and scientific reporting remain Liquid Agent's code.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 显式检测表格（中文）

检测契约在本地分析前明确单位和测量语义，不会将智能体变成固定工作流。QC 与差异表达是独立能力：用户可查看、讨论、运行、停止、转向或拒绝其中任何一项。Web 和 CLI 使用同一分析实现。

## 支持的操作

| 声明的检测类型 | 数值类型 | 计算 |
| --- | --- | --- |
| 数字 PCR | `partitions` | 泊松占有率浓度、由精确二项区间变换的 95% 区间、零值/饱和 QC |
| 循环肿瘤细胞 | `cell_counts` | 每 mL 计数、精确泊松 95% 区间 |
| 游离 RNA、小 RNA | `raw_counts`, `abundance`, `log_abundance` | 样本/特征 QC、缺失率、分布、高变特征概览、探索性 PCA |
| 血浆蛋白、代谢物 | `abundance`, `log_abundance` | 带声明单位的相同已处理矩阵 QC，不以计数模型替代 |
| EV 载荷 | `raw_counts`, `abundance`, `log_abundance` | 分子表格 QC，不证明 EV 纯度或来源 |
| CTC 分子谱 | `raw_counts` | 计数矩阵 QC，与细胞计数区分 |
| 甲基化芯片 | `beta` | Beta 表格 QC，不声称原始 IDAT 标准化或 DMR 分析 |
| 声明的独立组 RNA 计数对比 | 仅 `raw_counts` | PyDESeq2 负二项拟合、Wald 检验和校正后 p 值 |

在启动智能体所用环境中安装可选科学依赖：

```bash
python -m pip install -e '.[assay-tables]'
```

支持的 PyDESeq2 0.5.4 需要 NumPy 2，与既有可选 `blood-models` 依赖组的 NumPy 约束不兼容。不要强行合并不兼容的环境；这些既有编码器运行环境需要单独解析依赖。普通智能体可以检查前提条件，无需安装所有可选模型运行环境。

## 数据源契约

在输入表格旁放置以 `.assay.json` 结尾的小型 JSON 文件。例如：

```json
{
  "version": 1,
  "assay": "cell-free-rna",
  "table": "counts.csv",
  "value_kind": "raw_counts",
  "units": "reads",
  "metadata": "metadata.csv",
  "group_column": "condition",
  "contrast": ["case", "control"],
  "independent_samples": true,
  "synthetic": false
}
```

矩阵表格采用 CSV 或 TSV，第一列为唯一 `feature_id`，后面是唯一的样本列。元数据具有唯一 `sample_id` 值和声明的分组列。不从文件名或样本名推断分组。

```text
feature_id,S01,S02,S03,S04,S05,S06
GENE_A,12,18,14,42,38,45
GENE_B,31,29,34,27,30,32
```

此小型格式示例不足以进行离散度拟合。差异分析包装器要求至少十个总计数 >= 10 的特征、恰好两个声明组、每组至少三个独立样本，以及元数据与样本精确匹配。配对、患者、批次或时间协变量需要经过审阅的多因素工作流，此单因素包装器会拒绝它们。这些检查是最低技术门槛，不是功效分析。

对于无标签、仅 QC 的数据源，省略 `contrast`、`metadata` 和 `independent_samples`。丰度/beta 表格中的缺失值保持缺失。原始计数缺失、负计数、小数计数、无效 beta 值和重复 ID 会被拒绝，而非静默修复。相对输入路径必须留在清单文件夹内；符号链接逃逸会被拒绝。

## 数字 PCR 与 CTC 格式

数字 PCR 使用 `assay: digital-pcr` 和 `value_kind: partitions`。表格需要：

```text
sample_id,target,positive_partitions,total_partitions,partition_volume_nl,dilution_factor
S01,TARGET_A,120,18000,0.85,1
S02,TARGET_A,0,18000,0.85,2
```

计数指上游设门后**被接受的分区**。浓度为 `-ln(1 - positive/total) * 1000 / partition_volume_nl * dilution_factor`，单位是稀释前输入液每微升的拷贝数。转换到血浆体积还需明确提取/回收信息，不能推断。零阳性仍保留正的不确定性上界。全阳性孔属于饱和，报告将点估计和上界标记为无界，而非零。此计数包装器不提供重复聚合、空白/检出阈值或变异双重检测串扰拟合。

CTC 计数使用 `assay: circulating-tumour-cells`、`value_kind: cell_counts`：

```text
sample_id,cell_count,volume_ml
S01,10,7.5
S02,0,7.5
```

细胞身份与可接受计数标准必须已确立。引擎不估算富集效率，也不指定临床阈值。

## 从 Web 或 CLI 使用

正常添加数据源文件夹。让 LLM 检查检测契约，再请求聚焦计划或授权所需操作。`inspect_workspace` 暴露独立的 QC 和对比任务 ID；单纯提问不会运行任何一项。

如果没有契约，可用自然语言提供相同信息：

> 此 CSV 包含已接受的数字 PCR 分区。列为 sample_id、target、positive_partitions、total_partitions、partition_volume_nl 和 dilution_factor。请将其配置为以 copies/uL input 为单位的占有率定量。暂时不要运行分析。

`configure_assay` 工具验证结构化声明，并仅将声明的输入复制到当前对话工作区。它不会写入原始数据源或运行分析。模型必须询问未知的检测类型、单位或实验设计细节，而不是猜测。配置并不能证明上游设门、样本身份或临床验证正确。

不使用 LLM 的确定性、可复现 CLI 操作：

```bash
liquid-agent assay /path/to/source/input.assay.json --output /path/to/new/qc-run
liquid-agent assay /path/to/source/input.assay.json --output /path/to/new/contrast-run --differential
```

第二条命令是显式对比请求。第一条不会仅因清单包含对比声明就执行对比。

## 输出与解释

每次完成的运行发布 Markdown 报告、真实 PNG 图形、完整 CSV 测量/QC 表格和输入哈希。报告嵌入图形链接和有界表格预览。绝不覆盖原始表格。已有输出目录会被拒绝；取消或失败的运行不会发布已完成报告。智能体运行位于对话自有工作区，与其他结果遵循相同的回收站/恢复/彻底删除规则。

分布图最多展示 30 个样本；热图最多展示 40 个高变特征。完整 CSV 保留所有提供的测量值。PCA 使用所有样本中最多 2,000 个完整且可变的特征，并报告这一上限；不完整和恒定特征被排除，不会用虚构零值替换。计数 QC 使用 log2(CPM+1) 展示；PyDESeq2 接收未标准化整数计数，而不是这些绘图值。模型拟合警告和无法估计的检验保留在科学限制与诊断记录中。差异报告展示效应和校正后 p 值，而不仅是样本 QC。技术溯源保留在审计文件，不放在报告默认科学表格区域。

报告必须区分探索性发现与临床效用证据。支持已处理表格不等于支持端到端比对、蛋白鉴定、代谢物鉴定或完成真实队列验证。

## 复用的科学方法

实现调用维护中的库，而不是重新编写计数模型：[PyDESeq2](https://github.com/scverse/PyDESeq2) 及其[文档工作流](https://pydeseq2.readthedocs.io/en/stable/auto_examples/plot_minimal_pydeseq2_pipeline.html)、[statsmodels 二项区间](https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html)，以及用于精确泊松区间的 SciPy 卡方分位数函数。输入契约、所有权、取消和科学报告仍由 Liquid Agent 自身代码负责。
