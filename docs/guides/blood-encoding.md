<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Blood-Signal Encoding

The project keeps one internal blood-signal encoding core, with type-specific
user entry scripts on top.

For normal guided use, start from `liquid-agent` or `liquid-agent web` and ask
to encode the active dataset. The scripts below remain direct reproducible
entrypoints for advanced users.

## Type-Specific Entrypoints

- `scripts/encode_cfdna_foundation_features.py`
- `scripts/encode_epigenomic_signal_features.py`
- `scripts/encode_lpwgs_features.py`
- `scripts/encode_variant_features.py`

## Support Matrix

| Signal family | Default encoder | Optional encoders | Notes |
| --- | --- | --- | --- |
| `cfchip_seq` | `ntv2` | `dnabert2`, `hyenadna`, `caduceus`, `epibert`, `epcot`, `enformer`, `coverage_profile` | Use foundation encoders for interval/alignment inputs; `coverage_profile` for continuous tracks |
| `cfmedip_seq` | `epibert` | `ntv2`, `dnabert2`, `hyenadna`, `caduceus`, `epcot`, `enformer`, `coverage_profile` | Default leans methylation-aware |
| `medip_seq` | `epibert` | same as above | Same routing policy as `cfmedip_seq` |
| `lpwgs` / `ulpwgs` | `lpwgs_cnv_profile` | `coverage_profile`, DNA foundation encoders | Foundation encoders remain exploratory here |
| `ctdna_variant` / `variant` | `vcf_signature` | `variant_effect_profile` | `variant_effect_profile` expects pre-annotated effect scores |

## Accepted Inputs

Depending on signal family, the encoding layer supports:

- `bed`, `bed.gz`
- `narrowPeak`, `broadPeak`, `gappedPeak`
- `bam`, `cram`
- `bedGraph`, `WIG`, `bigWig`
- `vcf`, `vcf.gz`
- `maf`, `maf.gz`, `maf.tsv`, `maf.tsv.gz`
- `cnv_parquet`

## Design Rule

Use a foundation model when there is a biologically reasonable sequence-window
interpretation. Otherwise, keep the signal in a deterministic profile encoder
that preserves its native semantics.

## Why These Defaults

The current defaults are not simply the newest available models.

- `ntv2` remains the default interval encoder because it is mature, public, and
  still benchmark-competitive for general genomic representation learning.
- `epibert` remains the methylation-enrichment default because it is more
  modality-aligned than a generic sequence model, but users should treat its
  packaged checkpoint provenance more carefully than `ntv2` or `dnabert2`.
- `lpwgs_cnv_profile` stays the LPWGS default because LPWGS is still best
  treated as a copy-number / coverage problem, not a generic sequence-embedding
  problem.
- `vcf_signature` stays the variant default because raw VCF/MAF tables are
  sparse event tables, and optional effect-model aggregation should only be used
  when the upstream annotations are genuinely present.

For the full keep / optional / watchlist reasoning, see
[Components and Methods](../reference/components-and-methods.md).

## Core References

- [Nucleotide Transformer](https://www.nature.com/articles/s41592-024-02523-z)
- [DNABERT-2](https://proceedings.iclr.cc/paper_files/paper/2024/file/b633e7052970b8f5aa1a69164d99e9e8-Paper-Conference.pdf)
- [HyenaDNA](https://github.com/HazyResearch/hyena-dna)
- [Caduceus](https://github.com/kuleshov-group/caduceus)
- [EpiBERT](https://github.com/naumanjaved/EpiBERT)
- [EPCOT / EPCOTv2](https://epcot.io/docs/)
- [Enformer](https://github.com/google-deepmind/deepmind-research/tree/master/enformer)
- [2025 DNA foundation-model benchmark](https://www.nature.com/articles/s41467-025-65823-8)

## Examples

cfDNA foundation:

```bash
python scripts/encode_cfdna_foundation_features.py \
  --input_dir <dataset_or_subdir> \
  --fasta <fasta_path> \
  --model ntv2
```

Epigenomic:

```bash
python scripts/encode_epigenomic_signal_features.py \
  --signal cfchip_seq \
  --input_format bed.gz \
  --input_dir <input_dir> \
  --encoder ntv2
```

LPWGS:

```bash
python scripts/encode_lpwgs_features.py \
  --signal lpwgs \
  --input_format bed.gz \
  --input_dir <input_dir> \
  --encoder lpwgs_cnv_profile
```

Variant:

```bash
python scripts/encode_variant_features.py \
  --signal variant \
  --input_format vcf.gz \
  --input_dir <input_dir> \
  --encoder vcf_signature
```

## Metadata-Aware Follow-Up

After encoding, use metadata-aware cfDNA analysis or visualization to inspect
sample groups. The assistant can fuzzy-match approximate label names, such as
`her2`, `HER2`, `Her2`, or `response`, against available metadata columns and
ask for clarification only when multiple plausible choices remain.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 血液信号编码（中文）

项目保留一个内部血液信号编码核心，在其上提供按类型区分的用户入口脚本。

普通引导式使用从 `liquid-agent` 或 `liquid-agent web` 开始，请求对当前数据集编码。以下脚本仍是面向高级用户的可复现直接入口。

## 类型专用入口

- `scripts/encode_cfdna_foundation_features.py`
- `scripts/encode_epigenomic_signal_features.py`
- `scripts/encode_lpwgs_features.py`
- `scripts/encode_variant_features.py`

## 支持矩阵

| 信号家族 | 默认编码器 | 可选编码器 | 说明 |
| --- | --- | --- | --- |
| `cfchip_seq` | `ntv2` | `dnabert2`, `hyenadna`, `caduceus`, `epibert`, `epcot`, `enformer`, `coverage_profile` | 区间/比对输入使用基础模型编码器；连续轨道使用 `coverage_profile` |
| `cfmedip_seq` | `epibert` | `ntv2`, `dnabert2`, `hyenadna`, `caduceus`, `epcot`, `enformer`, `coverage_profile` | 默认倾向甲基化感知 |
| `medip_seq` | `epibert` | 同上 | 与 `cfmedip_seq` 使用相同路由策略 |
| `lpwgs` / `ulpwgs` | `lpwgs_cnv_profile` | `coverage_profile`、DNA 基础模型编码器 | 基础模型编码器在此仍属探索性 |
| `ctdna_variant` / `variant` | `vcf_signature` | `variant_effect_profile` | `variant_effect_profile` 需要预先注释的效应评分 |

## 接受的输入

根据不同信号家族，编码层支持：

- `bed`, `bed.gz`
- `narrowPeak`, `broadPeak`, `gappedPeak`
- `bam`, `cram`
- `bedGraph`, `WIG`, `bigWig`
- `vcf`, `vcf.gz`
- `maf`, `maf.gz`, `maf.tsv`, `maf.tsv.gz`
- `cnv_parquet`

## 设计规则

只有在存在生物学上合理的序列窗口解释时才使用基础模型。否则，使用保留信号原生语义的确定性谱型编码器。

## 为何选择这些默认值

当前默认值并非简单选择最新模型。

- `ntv2` 保持为默认区间编码器，因为它成熟、公开，且在通用基因组表示学习中仍有基准竞争力。
- `epibert` 保持为甲基化富集默认值，因为它比通用序列模型更贴合模态，但用户应比使用 `ntv2` 或 `dnabert2` 更谨慎地看待其打包检查点来源。
- `lpwgs_cnv_profile` 保持为 LPWGS 默认值，因为 LPWGS 最适合作为拷贝数/覆盖度问题处理，而非通用序列嵌入问题。
- `vcf_signature` 保持为变异默认值，因为原始 VCF/MAF 是稀疏事件表；只有上游注释确实存在时，才应采用可选效应模型聚合。

完整的保留/可选/观察列表理由见[组件与方法](../reference/components-and-methods.md)。

## 核心参考

- [Nucleotide Transformer](https://www.nature.com/articles/s41592-024-02523-z)
- [DNABERT-2](https://proceedings.iclr.cc/paper_files/paper/2024/file/b633e7052970b8f5aa1a69164d99e9e8-Paper-Conference.pdf)
- [HyenaDNA](https://github.com/HazyResearch/hyena-dna)
- [Caduceus](https://github.com/kuleshov-group/caduceus)
- [EpiBERT](https://github.com/naumanjaved/EpiBERT)
- [EPCOT / EPCOTv2](https://epcot.io/docs/)
- [Enformer](https://github.com/google-deepmind/deepmind-research/tree/master/enformer)
- [2025 年 DNA 基础模型基准](https://www.nature.com/articles/s41467-025-65823-8)

## 示例

cfDNA 基础模型：

```bash
python scripts/encode_cfdna_foundation_features.py \
  --input_dir <dataset_or_subdir> \
  --fasta <fasta_path> \
  --model ntv2
```

表观基因组：

```bash
python scripts/encode_epigenomic_signal_features.py \
  --signal cfchip_seq \
  --input_format bed.gz \
  --input_dir <input_dir> \
  --encoder ntv2
```

LPWGS：

```bash
python scripts/encode_lpwgs_features.py \
  --signal lpwgs \
  --input_format bed.gz \
  --input_dir <input_dir> \
  --encoder lpwgs_cnv_profile
```

变异：

```bash
python scripts/encode_variant_features.py \
  --signal variant \
  --input_format vcf.gz \
  --input_dir <input_dir> \
  --encoder vcf_signature
```

## 元数据感知的后续分析

编码后，使用元数据感知的 cfDNA 分析或可视化查看样本组。助手可将 `her2`、`HER2`、`Her2` 或 `response` 等近似标签名与可用元数据列进行模糊匹配，仅当仍有多个合理选项时才请求澄清。
