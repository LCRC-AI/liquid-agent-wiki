<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Blood-Signal Preprocessing

The preprocessing layer sits between raw or near-raw blood-biopsy inputs and
downstream encoding or analysis.

Main module:

- `src/liquidbiopsy_agent/preprocessing/`

Main entry scripts:

- `scripts/preprocess_epigenomic_signal.py`
- `scripts/preprocess_lpwgs_signal.py`
- `scripts/preprocess_variant_signal.py`

For normal guided use, start from `liquid-agent` or `liquid-agent web` and ask
for preprocessing in natural language. The direct scripts are still the
reproducible low-level route.

## What It Does

Current executable subset:

- interval / peak cleanup for BED-like inputs
- BAM / CRAM fragment materialization
- optional focus-region selection
- optional blacklist filtering
- optional fragment-length filtering
- epigenomic region-panel aggregation
- cfChIP background-aware summaries when a background BED is supplied
- cfMeDIP / MeDIP scale-factor normalization
- LPWGS bin-count export, lightweight correction, segmentation, and arm-burden summaries
- variant-table normalization with optional QUAL / VAF / CHIP filtering
- matched-normal / PBMC overlap filtering for variant tables

Still future-facing:

- true UMI consensus generation
- richer CNV models
- assay-specific cfChIP background models beyond the implemented supplied-background route

## Implemented Profiles

### `cfchip_seq`

- `cfchip_interval_cleanup`
- `cfchip_panel_summary`
- `cfchip_background_aware`

### `cfmedip_seq` / `medip_seq`

- cleanup-only profiles
- panel-summary profiles
- scale-normalized panel profiles

### `lpwgs` / `ulpwgs`

- `lpwgs_interval_cleanup` / `ulpwgs_interval_cleanup`
- `lpwgs_cleanup_only` / `ulpwgs_cleanup_only`
- `lpwgs_gc_corrected` / `ulpwgs_gc_corrected`

### `ctdna_variant` / `variant`

- `variant_table_qc`
- `variant_strict_somatic`
- `variant_matched_normal`

## Natural-Language Steering

When preprocessing is auto-inserted from a downstream task, the assistant now
passes the downstream goal into profile selection. That means cues such as:

- `promoter panel`
- `background-aware`
- `GC-corrected`
- `strict somatic`
- `matched normal`

still influence the selected implemented preprocessing route.

## Assistant Behavior

The assistant can:

- reuse compatible preprocessing outputs
- rerun preprocessing with a better-matched implemented profile
- skip preprocessing only when the downstream task is already directly runnable

This is the one place where LLM input participates in the decision but remains
constrained by explicit workflow legality checks.

## Method Provenance

The preprocessing layer is literature-grounded, but some implementations are
intentionally lighter than the canonical assay pipelines:

- LPWGS correction and segmentation are inspired by HMMcopy / ichorCNA-style
  workflows, but the current implementation is a pragmatic lightweight variant
  rather than a full reproduction.
- cfChIP preprocessing supports practical supplied-background normalization, not
  a full assay-native background model.
- cfMeDIP preprocessing includes useful normalization hooks, but not the full
  spike-in-centric quantitative workflow.
- variant preprocessing covers table-level QC, somatic-style filtering, and
  matched-normal overlap, but not true UMI-family consensus.

For references and rationale, see
[Components and Methods](../reference/components-and-methods.md).

Key references:

- [HMMcopy](https://bioconductor.org/packages/release/bioc/html/HMMcopy.html)
- [ichorCNA](https://www.nature.com/articles/s41467-017-00965-y)
- [cfChIP-seq](https://www.nature.com/articles/s41587-020-00775-6)
- [cfMeDIP-seq protocol](https://www.nature.com/articles/s41596-019-0202-2)
- [cfMeDIP spike-in controls](https://www.sciencedirect.com/science/article/pii/S266723752200176X)

## CLI Examples

Epigenomic:

```bash
python scripts/preprocess_epigenomic_signal.py \
  --signal cfchip_seq \
  --input_format bed.gz \
  --input_dir <raw_interval_dir> \
  --region_set_bed <region_panel_bed>
```

LPWGS:

```bash
python scripts/preprocess_lpwgs_signal.py \
  --signal lpwgs \
  --input_format bed.gz \
  --input_dir <lpwgs_interval_dir> \
  --bin_annotation_table <bin_annotation_table> \
  --arm_annotation_table <arm_annotation_table>
```

Variant:

```bash
python scripts/preprocess_variant_signal.py \
  --signal ctdna_variant \
  --input_format csv \
  --input_dir <variant_table_dir> \
  --exclude_chip_genes \
  --matched_normal_dir <matched_normal_variant_dir>
```

## Output Convention

Default root:

- `<dataset>/preprocessed/...`

Common outputs:

- `intervals/`
- `regions/`
- `bins/`
- `corrected_bins/`
- `segments/`
- `arm_burden/`
- `variants/`
- `preprocessing_summary.csv`
- `preprocessing_summary.json`

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 血液信号预处理（中文）

预处理层位于原始或近原始血液活检输入与下游编码/分析之间。

主要模块：

- `src/liquidbiopsy_agent/preprocessing/`

主要入口脚本：

- `scripts/preprocess_epigenomic_signal.py`
- `scripts/preprocess_lpwgs_signal.py`
- `scripts/preprocess_variant_signal.py`

普通引导式使用从 `liquid-agent` 或 `liquid-agent web` 开始，以自然语言请求预处理。直接脚本仍是可复现的底层路径。

## 功能

当前可执行的子集：

- BED 类输入的区间/峰清洗
- 从 BAM / CRAM 提取生成片段数据
- 可选重点区域选择
- 可选黑名单过滤
- 可选片段长度过滤
- 表观基因组区域 panel 聚合
- 提供背景 BED 时的 cfChIP 背景感知汇总
- cfMeDIP / MeDIP 缩放因子标准化
- LPWGS 分箱计数导出、轻量校正、分段和染色体臂负荷汇总
- 变异表格标准化，可选 QUAL / VAF / CHIP 过滤
- 变异表格的配对正常样本 / PBMC 重叠过滤

仍面向未来的部分：

- 真正的 UMI 共识生成
- 更丰富的 CNV 模型
- 超出已实现的用户提供背景路径的检测专用 cfChIP 背景模型

## 已实现的配置方案

### `cfchip_seq`

- `cfchip_interval_cleanup`
- `cfchip_panel_summary`
- `cfchip_background_aware`

### `cfmedip_seq` / `medip_seq`

- 仅清洗方案
- panel 汇总方案
- 缩放标准化 panel 方案

### `lpwgs` / `ulpwgs`

- `lpwgs_interval_cleanup` / `ulpwgs_interval_cleanup`
- `lpwgs_cleanup_only` / `ulpwgs_cleanup_only`
- `lpwgs_gc_corrected` / `ulpwgs_gc_corrected`

### `ctdna_variant` / `variant`

- `variant_table_qc`
- `variant_strict_somatic`
- `variant_matched_normal`

## 自然语言引导

当下游任务自动插入预处理时，助手现在会将下游目标传入配置选择。因此以下线索仍会影响所选的已实现预处理路径：

- `promoter panel`
- `background-aware`
- `GC-corrected`
- `strict somatic`
- `matched normal`

## 助手行为

助手可以：

- 复用兼容的预处理输出
- 使用更匹配的已实现配置重新运行预处理
- 仅在下游任务已经可直接运行时跳过预处理

这是一个 LLM 输入参与决策、但仍受显式工作流合法性检查约束的环节。

## 方法来源

预处理层以文献为依据，但部分实现有意比标准检测流水线更轻量：

- LPWGS 校正与分段受 HMMcopy / ichorCNA 类工作流启发，但当前是实用的轻量变体，而非完整复现。
- cfChIP 预处理支持实用的用户提供背景标准化，不是完整的检测原生背景模型。
- cfMeDIP 预处理包含有用的标准化接入点，但不是完整的以 spike-in 为核心的定量工作流。
- 变异预处理涵盖表格级 QC、体细胞式过滤和配对正常样本重叠，但不包含真正的 UMI 家族共识。

参考文献与理由见[组件与方法](../reference/components-and-methods.md)。

关键参考：

- [HMMcopy](https://bioconductor.org/packages/release/bioc/html/HMMcopy.html)
- [ichorCNA](https://www.nature.com/articles/s41467-017-00965-y)
- [cfChIP-seq](https://www.nature.com/articles/s41587-020-00775-6)
- [cfMeDIP-seq 实验方案](https://www.nature.com/articles/s41596-019-0202-2)
- [cfMeDIP spike-in 对照](https://www.sciencedirect.com/science/article/pii/S266723752200176X)

## CLI 示例

表观基因组：

```bash
python scripts/preprocess_epigenomic_signal.py \
  --signal cfchip_seq \
  --input_format bed.gz \
  --input_dir <raw_interval_dir> \
  --region_set_bed <region_panel_bed>
```

LPWGS：

```bash
python scripts/preprocess_lpwgs_signal.py \
  --signal lpwgs \
  --input_format bed.gz \
  --input_dir <lpwgs_interval_dir> \
  --bin_annotation_table <bin_annotation_table> \
  --arm_annotation_table <arm_annotation_table>
```

变异：

```bash
python scripts/preprocess_variant_signal.py \
  --signal ctdna_variant \
  --input_format csv \
  --input_dir <variant_table_dir> \
  --exclude_chip_genes \
  --matched_normal_dir <matched_normal_variant_dir>
```

## 输出约定

默认根目录：

- `<dataset>/preprocessed/...`

常见输出：

- `intervals/`
- `regions/`
- `bins/`
- `corrected_bins/`
- `segments/`
- `arm_burden/`
- `variants/`
- `preprocessing_summary.csv`
- `preprocessing_summary.json`
