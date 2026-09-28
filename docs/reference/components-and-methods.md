<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Components And Methods

This page explains the main liquid-biopsy components used by the current product layer, why they are used, and which newer methods are worth watching. The selection principle is conservative: prefer mature, inspectable, reproducible tools over newer components that are impressive but hard to operate safely.

For a table-first inventory of all callable workflows, encoders, external runtimes, method guidance, LLM engines, and supported data types, see [Capability Matrix](capability-matrix.md).

## Decision Principles

- Keep raw biological semantics visible whenever possible.
- Use foundation encoders only when the input representation matches the biology.
- Prefer deterministic profiles for sparse event tables and copy-number style signals.
- Keep preprocessing explicit and auditable.
- Treat exploratory plots as hypothesis-generating, not clinically validated evidence.
- Track newer models, but do not make them defaults until access, weights, runtime, and validation are practical.

## Blood-Signal Preprocessing

### Epigenomic Interval Preprocessing

Used for cfChIP, cfMeDIP/MeDIP, peak-like intervals, and enrichment-style tables.

Why it is kept:

- interval cleanup and region summarization are mature and easy to audit
- background-aware summaries reduce misleading signal shifts
- downstream feature stores can consume region-level tables directly

### LPWGS / ULPWGS Preprocessing

Used for shallow whole-genome cfDNA copy-number style analysis.

Why it is kept:

- LPWGS is primarily a coverage and copy-number problem
- GC-aware bin preparation, segmentation, and arm-burden summaries are more defensible than generic sequence embeddings for this signal family
- outputs connect directly to CNV-focused analysis and visualization

### Variant Preprocessing

Used for VCF, MAF, and variant-style tables.

Why it is kept:

- variant data are sparse event tables, not continuous sequence windows
- matched-normal awareness, strict somatic-style filtering, and VAF summaries are central to credible interpretation
- effect-model aggregation should only be used when upstream annotations are genuinely present

## Blood-Signal Encoders

| Encoder | Current role | Why used |
| --- | --- | --- |
| `ntv2` | default cfChIP interval encoder | mature public genomic foundation model; strong general-purpose DNA representations |
| `epibert` | default cfMeDIP / MeDIP route | better aligned with methylation-enrichment style questions than generic sequence models |
| `lpwgs_cnv_profile` | default LPWGS / ULPWGS encoder | preserves coverage and copy-number semantics |
| `coverage_profile` | continuous track encoder | deterministic, inspectable profile for bedGraph/WIG/bigWig style inputs |
| `vcf_signature` | default variant encoder | robust sparse-event summary for VCF/MAF tables |
| `variant_effect_profile` | optional variant encoder | useful only when effect scores such as CADD, SpliceAI, or DeepSEA already exist |
| `dnabert2` | optional sequence encoder | mature DNA language model baseline |
| `hyenadna` | optional long-context sequence encoder | useful watchlist model for long genomic contexts |
| `caduceus` | optional sequence encoder | bidirectional DNA state-space architecture worth tracking |
| `epcot` | optional regulatory sequence encoder | strong regulatory modeling family; use only when input assumptions fit |
| `enformer` | optional regulatory sequence encoder | established enhancer/promoter-style sequence model baseline |

## Default Encoder Rationale

### Nucleotide Transformer

Nucleotide Transformer remains the most practical default for general DNA interval representation because it is public, mature, and broadly benchmarked.

Watchlist: NT v3 should be evaluated when a stable public workflow and local resource profile are clear enough for routine users.

Reference: [Nucleotide Transformer](https://www.nature.com/articles/s41592-024-02523-z)

### EpiBERT

EpiBERT is kept as the methylation-enrichment default because it is closer to the assay semantics than generic DNA sequence embedding. It should still be documented carefully because checkpoint provenance and operating assumptions matter.

Reference: [EpiBERT](https://github.com/naumanjaved/EpiBERT)

### LPWGS CNV Profile

For LPWGS/ULPWGS, the correctness-first route is coverage and copy-number profiling. A generic sequence model can obscure the signal that analysts actually need to inspect.

### VCF Signature

Variant tables should start with event-count, VAF, gene, recurrence, and filtering summaries. Effect-model features are optional and annotation-dependent.

## cfDNA Analysis Methods

Standard cfDNA analysis covers:

- feature-space summaries
- sample similarity and correlation
- outlier detection
- group comparisons
- region-signal summaries
- CNV summaries
- arm-burden summaries
- segment-aware cohort outputs when available

Visualization covers:

- UMAP, t-SNE, and PCA projections
- metadata-coloured sample scatter plots
- heatmaps and cohort summaries
- region-level plots
- CNV cohort plots

UMAP should be the preferred default projection when installed, t-SNE is the next nonlinear option, and PCA is the stable fallback.

## Raw-Signal Methods

Raw-signal suites are included because many liquid-biopsy workflows first inspect the measured signal before model-based analysis.

Covered outputs:

- fragment-length distributions
- genome-wide signal profiles
- sample-by-bin heatmaps
- region metaprofiles
- VAF views
- arm-level burden plots and tables
- motif summaries
- browser-track inventories
- longitudinal summaries when sample-time metadata exists

## Method Advisor

The method advisor adds a structured bridge between internal analysis routes, mature external tools, and explicitly marked research/watchlist liquid-biopsy methods. It is used when the user asks which method, tool, or algorithm should be considered for a dataset or assay question.

It currently tracks mature or commonly used routes for:

- fragmentomics: FinaleToolkit, cfDNAPro, DELFI-style features, Griffin, LIQUORICE, LBFextract, cfDNAFE, cfDNAanalyzer, EMIT, DeepFRAG
- broad cfDNA WGS/WGBS workflows: cfDNApipe and cfDNA UniFlow as optional external routes
- copy-number analysis: ichorCNA, QDNAseq, WisecondorX, HMMcopy readcount correction, CNVkit, Control-FREEC, CopywriteR, FACETS/facetsSuite, PureCN, BayesCNV
- methylation enrichment: QSEA and MEDIPS
- bisulfite, EM-seq, or nanopore methylation: Bismark, MethylDackel, nf-core/methylseq, Dorado, modkit
- methylation follow-up and advanced models: FinaleMe, cfTools/cfSort, MethylBERT, cfDecon, CelFiE-ISH, CelFEER, UXM, MethAtlas, cfNOMe, MetDecode, CpGPT, MethylGPT, MethFormer, cfMethylPre
- ctDNA variants: fgbio UMI consensus and low-VAF callers such as Mutect2, LoFreq, and VarDict
- cfRNA, EV-miRNA, CTC tables, and plasma proteomics as guidance-first routes

The advisor checks local dependency status and writes JSON/Markdown reports. If an external tool is not installed or needs assay-specific reference resources, the agent should report that clearly and continue with safe internal summaries when possible.

Usage reference: [Liquid-Biopsy Method Advisor](liquid-biopsy-methods.md)

## References

- [Nucleotide Transformer](https://www.nature.com/articles/s41592-024-02523-z)
- [DNABERT-2](https://proceedings.iclr.cc/paper_files/paper/2024/file/b633e7052970b8f5aa1a69164d99e9e8-Paper-Conference.pdf)
- [HyenaDNA](https://github.com/HazyResearch/hyena-dna)
- [Caduceus](https://github.com/kuleshov-group/caduceus)
- [EpiBERT](https://github.com/naumanjaved/EpiBERT)
- [EPCOT / EPCOTv2](https://epcot.io/docs/)
- [Enformer](https://github.com/google-deepmind/deepmind-research/tree/master/enformer)
- [UMAP](https://umap-learn.readthedocs.io/en/latest/)
- [scikit-learn t-SNE](https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html)
- [FinaleToolkit](https://github.com/epifluidlab/FinaleToolkit)
- [cfDNAPro](https://github.com/hw538/cfDNAPro)
- [LBFextract](https://lbf.readthedocs.io/en/latest/)
- [cfDNApipe](https://github.com/XWangLabTHU/cfDNApipe)
- [ichorCNA](https://github.com/broadinstitute/ichorCNA)
- [QDNAseq](https://bioconductor.org/packages/QDNAseq/)
- [WisecondorX](https://github.com/CenterForMedicalGeneticsGhent/WisecondorX)
- [HMMcopy](https://bioconductor.org/packages/release/bioc/html/HMMcopy.html)
- [CNVkit](https://cnvkit.readthedocs.io/)
- [Control-FREEC](https://github.com/BoevaLab/FREEC)
- [QSEA](https://bioconductor.org/packages/release/bioc/vignettes/qsea/inst/doc/qsea_tutorial.html)
- [Bismark](https://pmc.ncbi.nlm.nih.gov/articles/PMC3102221/)
- [FinaleMe](https://github.com/epifluidlab/FinaleMe)
- [cfTools](https://www.bioconductor.org/packages/release/bioc/html/cfTools.html)

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 组件与方法（中文）

本页解释当前产品层采用的主要液体活检组件、选用理由及值得关注的新方法。选择原则保守：优先成熟、可检查、可复现的工具，而非虽令人印象深刻却难以安全操作的新组件。

全部可调用工作流、编码器、外部运行环境、方法指导、LLM 引擎和数据类型的表格清单见[能力矩阵](capability-matrix.md)。

## 决策原则

- 尽可能保持原始生物学语义可见。
- 仅当输入表示与生物学匹配时使用基础模型编码器。
- 稀疏事件表和拷贝数类信号优先使用确定性谱型。
- 预处理保持显式且可审计。
- 探索性图形用于提出假设，不视为临床验证证据。
- 跟踪新模型，但在访问、权重、运行环境和验证切实可行前，不设为默认。

## 血液信号预处理

### 表观基因组区间预处理

用于 cfChIP、cfMeDIP/MeDIP、峰类区间和富集类表格。

保留理由：

- 区间清洗与区域汇总成熟且易审计
- 背景感知汇总减少误导性信号偏移
- 下游特征存储可直接使用区域级表格

### LPWGS / ULPWGS 预处理

用于低深度全基因组 cfDNA 拷贝数类分析。

保留理由：

- LPWGS 主要是覆盖度和拷贝数问题
- 对此信号家族，GC 感知分箱准备、分段和染色体臂负荷汇总比通用序列嵌入更有依据
- 输出直接连接 CNV 分析与可视化

### 变异预处理

用于 VCF、MAF 和变异类表格。

保留理由：

- 变异数据是稀疏事件表，不是连续序列窗口
- 配对正常样本感知、严格体细胞式过滤和 VAF 汇总是可信解释的核心
- 仅上游注释确实存在时才应使用效应模型聚合

## 血液信号编码器

| 编码器 | 当前角色 | 使用原因 |
| --- | --- | --- |
| `ntv2` | 默认 cfChIP 区间编码器 | 成熟公开的基因组基础模型；通用 DNA 表示能力强 |
| `epibert` | 默认 cfMeDIP / MeDIP 路径 | 比通用序列模型更贴合甲基化富集类问题 |
| `lpwgs_cnv_profile` | 默认 LPWGS / ULPWGS 编码器 | 保留覆盖度与拷贝数语义 |
| `coverage_profile` | 连续轨道编码器 | bedGraph/WIG/bigWig 输入的确定性、可检查谱型 |
| `vcf_signature` | 默认变异编码器 | VCF/MAF 表的稳健稀疏事件汇总 |
| `variant_effect_profile` | 可选变异编码器 | 仅已存在 CADD、SpliceAI 或 DeepSEA 等效应评分时有用 |
| `dnabert2` | 可选序列编码器 | 成熟 DNA 语言模型基线 |
| `hyenadna` | 可选长上下文序列编码器 | 值得关注的长基因组上下文模型 |
| `caduceus` | 可选序列编码器 | 值得跟踪的双向 DNA 状态空间架构 |
| `epcot` | 可选调控序列编码器 | 强调控建模家族；仅在输入假设匹配时使用 |
| `enformer` | 可选调控序列编码器 | 成熟的增强子/启动子类序列模型基线 |

## 默认编码器理由

### Nucleotide Transformer

Nucleotide Transformer 公开、成熟且经过广泛基准测试，仍是通用 DNA 区间表示最实用的默认选择。

观察列表：当稳定公开工作流和本地资源需求对普通用户足够明确时，应评估 NT v3。

参考：[Nucleotide Transformer](https://www.nature.com/articles/s41592-024-02523-z)

### EpiBERT

EpiBERT 比通用 DNA 序列嵌入更贴合检测语义，因此保留为甲基化富集默认值。仍需谨慎记录，因为检查点来源和操作假设很重要。

参考：[EpiBERT](https://github.com/naumanjaved/EpiBERT)

### LPWGS CNV Profile

对 LPWGS/ULPWGS，正确性优先的路径是覆盖度与拷贝数谱型分析。通用序列模型可能掩盖分析人员真正需要查看的信号。

### VCF Signature

变异表应从事件计数、VAF、基因、复现频率和过滤汇总开始。效应模型特征是依赖注释的可选项。

## cfDNA 分析方法

标准 cfDNA 分析涵盖：

- 特征空间汇总
- 样本相似性与相关性
- 离群值检测
- 组间比较
- 区域信号汇总
- CNV 汇总
- 染色体臂负荷汇总
- 可用时的分段感知队列输出

可视化涵盖：

- UMAP、t-SNE 和 PCA 投影
- 按元数据着色的样本散点图
- 热图与队列汇总
- 区域级图
- CNV 队列图

已安装时 UMAP 应为首选默认投影，t-SNE 是下一非线性选择，PCA 是稳定回退。

## 原始信号方法

纳入原始信号套件，是因为许多液体活检工作流在基于模型分析前先查看实测信号。

覆盖输出：

- 片段长度分布
- 全基因组信号概览
- 样本与分箱热图
- 区域元剖面图
- VAF 视图
- 染色体臂级负荷图与表
- 基序汇总
- 浏览器轨道清单
- 存在样本时间元数据时的纵向汇总

## 方法顾问

方法顾问在内部分析路径、成熟外部工具和明确标记的研究/观察列表液体活检方法间建立结构化桥梁。当用户询问某个数据集或检测问题应考虑何种方法、工具或算法时使用。

当前跟踪的成熟或常用路径：

- 片段组学：FinaleToolkit、cfDNAPro、DELFI 类特征、Griffin、LIQUORICE、LBFextract、cfDNAFE、cfDNAanalyzer、EMIT、DeepFRAG
- 广泛 cfDNA WGS/WGBS 工作流：cfDNApipe 和 cfDNA UniFlow 作为可选外部路径
- 拷贝数分析：ichorCNA、QDNAseq、WisecondorX、HMMcopy readcount 校正、CNVkit、Control-FREEC、CopywriteR、FACETS/facetsSuite、PureCN、BayesCNV
- 甲基化富集：QSEA 和 MEDIPS
- 亚硫酸氢盐、EM-seq 或纳米孔甲基化：Bismark、MethylDackel、nf-core/methylseq、Dorado、modkit
- 甲基化后续与高级模型：FinaleMe、cfTools/cfSort、MethylBERT、cfDecon、CelFiE-ISH、CelFEER、UXM、MethAtlas、cfNOMe、MetDecode、CpGPT、MethylGPT、MethFormer、cfMethylPre
- ctDNA 变异：fgbio UMI 共识，以及 Mutect2、LoFreq、VarDict 等低 VAF 检测工具
- cfRNA、EV-miRNA、CTC 表和血浆蛋白组学作为指导优先路径

顾问检查本地依赖状态并写入 JSON/Markdown 报告。外部工具未安装或需要检测专用参考资源时，智能体应明确报告，并在可能时继续安全内部汇总。

使用参考：[液体活检方法顾问](liquid-biopsy-methods.md)

## 参考资料

- [Nucleotide Transformer](https://www.nature.com/articles/s41592-024-02523-z)
- [DNABERT-2](https://proceedings.iclr.cc/paper_files/paper/2024/file/b633e7052970b8f5aa1a69164d99e9e8-Paper-Conference.pdf)
- [HyenaDNA](https://github.com/HazyResearch/hyena-dna)
- [Caduceus](https://github.com/kuleshov-group/caduceus)
- [EpiBERT](https://github.com/naumanjaved/EpiBERT)
- [EPCOT / EPCOTv2](https://epcot.io/docs/)
- [Enformer](https://github.com/google-deepmind/deepmind-research/tree/master/enformer)
- [UMAP](https://umap-learn.readthedocs.io/en/latest/)
- [scikit-learn t-SNE](https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html)
- [FinaleToolkit](https://github.com/epifluidlab/FinaleToolkit)
- [cfDNAPro](https://github.com/hw538/cfDNAPro)
- [LBFextract](https://lbf.readthedocs.io/en/latest/)
- [cfDNApipe](https://github.com/XWangLabTHU/cfDNApipe)
- [ichorCNA](https://github.com/broadinstitute/ichorCNA)
- [QDNAseq](https://bioconductor.org/packages/QDNAseq/)
- [WisecondorX](https://github.com/CenterForMedicalGeneticsGhent/WisecondorX)
- [HMMcopy](https://bioconductor.org/packages/release/bioc/html/HMMcopy.html)
- [CNVkit](https://cnvkit.readthedocs.io/)
- [Control-FREEC](https://github.com/BoevaLab/FREEC)
- [QSEA](https://bioconductor.org/packages/release/bioc/vignettes/qsea/inst/doc/qsea_tutorial.html)
- [Bismark](https://pmc.ncbi.nlm.nih.gov/articles/PMC3102221/)
- [FinaleMe](https://github.com/epifluidlab/FinaleMe)
- [cfTools](https://www.bioconductor.org/packages/release/bioc/html/cfTools.html)
