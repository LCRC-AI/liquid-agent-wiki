<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Liquid-Biopsy Capability Matrix

This page is the single overview of the current user-facing Liquid Agent capability surface. It maps callable models, tools, methods, and workflow blocks to the liquid-biopsy data types they handle.

## Status Semantics

| Status | Meaning |
| --- | --- |
| Internal executable | Liquid Agent can run this through the Python kernel, scripts, shell, Web API, or autopilot when required inputs exist. |
| Internal model / encoder | The model or deterministic encoder is registered in the blood-signal encoding layer. |
| External runtime wrapper | Liquid Agent can check, install/prepare where possible, smoke-test, and call the runtime through `liquid-agent tools`. Real analysis may still need model files, references, manifests, or compatible input files. |
| External method guidance | The method advisor can recommend it, show requirements, and choose internal fallbacks, but no stable local wrapper is registered yet. |
| Reimplementation candidate | The original method is useful but the public runtime is too old or unstable for ordinary users; prefer a future small internal proxy or a maintained alternative. |
| LLM engine | Used for conversation, planning support, documentation context, result explanation, and recovery suggestions. It is not a biomedical signal model. |

## Recently Added Kernel Features

| Feature | Status | Data or question type | User-facing entrypoints |
| --- | --- | --- | --- |
| Frozen prediction studies | Internal executable | Explicit binary train/validation contracts; logistic, SVM and forest candidates; training-only preprocessing and threshold selection; ROC/PR/calibration and frozen probabilities | Natural-language Web/CLI tools; see [prediction studies](../guides/prediction-studies.md). Not a separate Plan-button entry or automatic clinical cohort design. |
| Paired prediction comparisons | Internal executable | Two to six completed feature-set studies with matching cohorts and unchanged inputs/probabilities; paired AUROC differences without parent refitting | Natural-language Web/CLI tools and owned Results reports; exploratory intervals, not multiplicity-adjusted or clinical validation |
| Liquid-biopsy method advisor registry | Internal executable | Method/tool questions across fragmentomics, methylation, copy-number, variants, cfRNA, small RNA, CTC tables, and proteomics | `/methods`, `liquid-agent methods`, `scripts/run_liquid_biopsy_method_advisor.py`, Web Method advice button, Python API |
| Named-tool ranking | Internal executable | Questions that explicitly name tools such as cfDNAPro, WisecondorX, FinaleMe, or cfTools | Natural language, `/methods`, CLI, Web API |
| Dependency and manual-resource status | Internal executable | External methods that require executables, R packages, Python modules, Java, reference panels, model files, or code bundles | Method-advice JSON/Markdown reports |
| External runtime manager | Internal executable | Selected non-kernel Python, R/Bioconductor, source, Snakemake, and system-binary tools | `liquid-agent tools status/install/smoke/run`, external-tool status reports |
| Supplied signal-matrix analysis | Internal executable | Processed CNV, methylation, EPIC-like methylated/unmethylated, or other liquid-biopsy numeric matrices | `scripts/run_cfdna_analysis_suite.py`, `scripts/run_cfdna_plot_suite.py`, `/plan`, `/autopilot`, Web results |
| Metadata profile scanner | Internal executable | CSV, TSV, Excel, Parquet, JSON, JSONL, and NDJSON metadata or label tables | `/metadata`, Web Metadata card, Web scan/plan responses, planner inputs |
| Label-aware planning | Internal executable | Datasets with candidate sample labels, groups, response/status columns, or user-selected labels | `/plan`, `/metadata use`, Web Change/Ignore controls; chooses unsupervised, grouped, or exploratory supervised mode |
| Exploratory supervised modeling | Internal executable when backend is available | Labeled feature stores, embeddings, or processed signal matrices with adequate matched labels | Standard cfDNA analysis task; `sklearn_logistic_regression` by default, optional `pytorch_linear_probe` for larger labeled cohorts |
| Markdown-first result reports | Internal executable | Completed runs, generated tables, static figures, method-advice reports, and result evaluations | Web Results panel, `liquid-agent results`, autopilot reports; hides backend JSON/TXT/HTML clutter from the default user view |
| Agent planning integration | Internal executable | Dataset folders with blood raw candidates, fragmentomics outputs, CNV inputs, coverage tracks, variant inputs, region-signal tables, or browser-track style inputs | `/plan`, `/autopilot`, Web scan/plan |
| LiquidBiopsyDataState summary | Internal executable | Any scanned liquid-biopsy source or generated result set | Backend planner, result evaluator, plan ledger, autopilot report; records signal families, input/output counts, metadata coverage, minimum-output contract gaps, blockers, and safe next actions without adding user-facing controls |
| Liquid-biopsy FeatureBook contracts | Internal executable | Fragmentomics, methylation, copy-number, variant, supplied matrix, archive, and metadata/grouped-comparison contexts | Planner, result evaluator, plan ledger, autopilot report, Python API; tracks expected artifacts, QC checks, interpretation limits, and satisfied/pending contract status |
| ToolCard output-kind verification | Internal executable | Completed backend tasks and external-wrapper task summaries | Executor, plan ledger, autopilot report; verifies minimum output kinds such as summary, table, figure, method-advice report, review, or feature store; a bare output directory is not treated as completion, but real result files inside a reported output/run directory are sampled and counted |
| Content-derived result signals | Internal executable | Ranked effect tables, grouped summaries, label-metric summaries, sample outlier tables, and summary JSONs from liquid-biopsy runs | Result evaluator, planner notes, plan ledger, autopilot report; can promote ready visualization, raw-signal follow-up, signal-aware method advice, or review tasks without adding user-facing controls |
| Result-driven analysis concepts | Internal executable | Content-derived liquid-biopsy result signals plus FeatureBook contracts | Result evaluator, planner notes, plan ledger, autopilot report; converts real evidence into prioritized auditable follow-up questions, suggested task families, QC checks, interpretation limits, and stable novelty keys without adding user-facing controls |
| Method-advice internal fallback routing | Internal executable | Method-advice JSON with top methods, resource limits, and internal fallback routes | Planner and plan ledger; can map fallback evidence back to ready standard cfDNA analysis, standard visualization, raw-signal analysis, or raw-signal visualization without adding user-facing controls |
| Source-aware Web method advice | Internal executable | Single-source or multi-source Web sessions | `POST /api/session/{session_id}/methods/advice` |
| Planner robustness for incomplete candidates | Internal executable | Folders with incomplete candidate files where encoding cannot be safely planned yet | Planning continues with feasible tasks and records a note instead of crashing |
| Documentation and prompt examples for method advice | Documentation | Natural-language examples and reproducible command forms | README, docs site, script cookbook |

## Direct Internal Workflow Blocks

### Explicit Assay Contracts

These operations use a validated `*.assay.json` declaration or the controller's
`configure_assay` tool. They are not inferred from a filename or started by loading
a skill. See [schemas and limits](../guides/assay-tables.md).

| Operation | Implemented engine | Boundary |
| --- | --- | --- |
| Digital-PCR accepted partitions | Occupancy concentration and transformed exact-binomial 95% intervals | No raw droplet gating, duplex fitting or clinical detection threshold |
| CTC accepted counts/volume | Cells per mL and exact Poisson 95% intervals | No image-based identity assignment or enrichment correction |
| RNA, protein, metabolite and EV processed matrices | Missingness, distributions, sample/feature QC, bounded PCA and heatmaps | Not raw instrument identification or biological source validation |
| Methylation beta matrices | Range validation, missingness and sample/probe displays | Not IDAT normalization, conversion QC or DMR fitting |
| Independent-group RNA raw counts | PyDESeq2, Wald tests and adjusted p-values | Explicit separate request; no paired/batch/time design; experimental replication required |

Every completed operation produces a Markdown report, actual PNG/CSV outputs and
provenance. Optional dependencies are checked when used.

### Existing Workflow Blocks

| Workflow block | Status | Main data types | Main entrypoints | Typical outputs |
| --- | --- | --- | --- | --- |
| Dataset/source scanning | Internal executable | Folders, files, multiple attached liquid-biopsy sources | `/use`, `/sources`, Web source manager, `scan_project_profile(...)` | Detected signal candidates, labels, outputs, source inventory |
| Blood-signal preprocessing | Internal executable | BED/BED.GZ, peak files, BAM/CRAM, VCF/MAF, CSV/TSV/parquet variant tables | `/preprocess`-style natural language, autopilot, `scripts/preprocess_*_signal.py`, Python API | Cleaned intervals, region-signal tables, bin counts, segments, arm burden, normalized variant tables, summaries |
| Blood-signal encoding | Internal executable | cfChIP/cfMeDIP/MeDIP intervals or alignments, LPWGS/ULPWGS intervals or CNV tables, VCF/MAF variant tables, continuous tracks | `/blood`, natural language, `scripts/encode_*_features.py`, Python API | Feature stores, encoder summaries, reusable per-sample vectors |
| Standard cfDNA analysis | Internal executable | Feature stores, fragmentomics summaries, methylation-proxy tables, CNV directories, region-signal tables, supplied CNV/methylation/signal matrices, labels | `scripts/run_cfdna_analysis_suite.py`, autopilot, Python API | Distance/correlation/outlier summaries, grouped metrics, supplied-matrix summaries, module summaries |
| Standard cfDNA visualization | Internal executable | Feature stores, metadata/labels, fragmentomics summaries, methylation-proxy tables, CNV directories, supplied CNV/methylation/signal matrices | `scripts/run_cfdna_plot_suite.py`, autopilot, Python API | UMAP/t-SNE/PCA scatter, heatmaps, grouped plots, supplied-matrix PNG outputs, static figures for markdown reports, optional Plotly HTML files from Python |
| Raw-signal visualization | Internal executable | Fragment directories, CNV/bin directories, coverage tracks, region-signal tables, variant inputs, end-motif tables, loci tables | `scripts/run_cfdna_raw_signal_suite.py`, autopilot, Python API | Fragment-length plots, genomewide profiles, sample/bin heatmaps, region metaprofiles, VAF plots, motif plots, browser-track inventories, optional Plotly HTML files from Python |
| Raw-signal numeric analysis | Internal executable | Fragment directories, CNV/bin directories, coverage tracks, region-signal tables, variant inputs, end-motif tables, sample-time tables, browser-track files | `scripts/run_cfdna_raw_signal_analysis_suite.py`, autopilot, Python API | Fragmentomics metrics, CNV summaries, arm burden, VAF summaries, longitudinal summaries, browser-track summaries, numeric report JSON |
| Method/tool advice | Internal executable | Dataset folders and natural-language method questions | `/methods`, CLI, Web API, Python API | `liquid_biopsy_method_advice.json`, `liquid_biopsy_method_advice.md` |
| Result review and report summary | Internal executable | Existing Liquid Agent outputs and reports | `/review`, autopilot final pass, Python API | Consolidated review JSON/TXT, next actions |
| Closed-loop agent ledger and result evaluation | Internal executable | Dataset scans, generated summaries, content-derived result signals, result-driven analysis concepts, pending/actioned/blocked concept lifecycle records, method-advice content, tables, figures, reports, failures, and run records | `/plan`, `/autopilot`, Web plan/run/results, `PlanLedger`, `PlanLedger.concept_memory()`, `PlanLedger.write_concept_book()`, `evaluate_project_results(...)` | `assistant/ledger/plan_*.json`, `run_*.json`, `result_evaluation_*.json`, `analysis_concept_book.json`, planner evidence notes, plan-level concept-memory snapshots and deltas, concept verification and blocker status, concept-memory-grounded next actions, audit-style autopilot reports |
| FeatureBook-based signal verification | Internal executable | Common liquid-biopsy signal families and generated artifacts | Internal planner/evaluator, `list_feature_specs(...)`, `compile_user_analysis_idea(...)` | Feature contracts, compiled user idea, plan novelty evidence, report-level satisfied/pending status |
| Professional skill memory and workflow contracts | Internal executable | Markdown, text, PDFs where supported by runtime, URLs, directories, expert notes, `workflow.yaml` playbooks | `/skills`, `/skills explain-plan`, Web skills endpoints, Python API | Skill documents, skill cache, workflow triggers, required outputs, quality checks, context snippets for future planning |

## Preprocessing Profiles

| Signal family | Supported inputs | Default profile | Other callable profiles | Main data products |
| --- | --- | --- | --- | --- |
| `cfchip_seq` | BED/BED.GZ, narrowPeak/broadPeak/gappedPeak, BAM/CRAM | `cfchip_interval_cleanup` | `cfchip_panel_summary`, `cfchip_background_aware` | Cleaned intervals, optional region-panel summaries, optional background-normalized summaries |
| `cfmedip_seq` | BED/BED.GZ, narrowPeak/broadPeak/gappedPeak, BAM/CRAM | `cfmedip_interval_cleanup` | `cfmedip_panel_summary`, `cfmedip_scale_normalized_panel` | Cleaned intervals, methylation-panel summaries, optional scale-normalized summaries |
| `medip_seq` | BED/BED.GZ, narrowPeak/broadPeak/gappedPeak, BAM/CRAM | `medip_interval_cleanup` | `medip_panel_summary`, `medip_scale_normalized_panel` | Same route as cfMeDIP-style methylation enrichment |
| `lpwgs` | BED/BED.GZ, BAM/CRAM | `lpwgs_interval_cleanup` | `lpwgs_cleanup_only`, `lpwgs_gc_corrected` | Cleaned intervals, genome bins, corrected bins when annotations exist, segments, arm burden |
| `ulpwgs` | BED/BED.GZ, BAM/CRAM | `ulpwgs_interval_cleanup` | `ulpwgs_cleanup_only`, `ulpwgs_gc_corrected` | Same route as LPWGS, tuned for ultra-low-pass data |
| `ctdna_variant` | VCF/VCF.GZ, MAF/MAF.GZ, MAF TSV, CSV/TSV/parquet tables | `variant_table_qc` | `variant_strict_somatic`, `variant_matched_normal` | Normalized variant tables, conservative filters, matched-normal overlap filtering when supplied |
| `variant` | VCF/VCF.GZ, MAF/MAF.GZ, MAF TSV, CSV/TSV/parquet tables | `variant_table_qc` | `variant_strict_somatic`, `variant_matched_normal` | Same route as ctDNA variant preprocessing |

## Internal Encoders And Models

| Signal family | Data types | Default encoder/model | Optional encoders/models | Status |
| --- | --- | --- | --- | --- |
| `cfchip_seq` | BED/BED.GZ, peak files, BAM/CRAM, bedGraph/WIG/bigWig | `ntv2` | `dnabert2`, `hyenadna`, `caduceus`, `epibert`, `epcot`, `enformer`, `coverage_profile` | Internal model / encoder |
| `cfmedip_seq` | BED/BED.GZ, peak files, BAM/CRAM, bedGraph/WIG/bigWig | `epibert` | `ntv2`, `dnabert2`, `hyenadna`, `caduceus`, `epcot`, `enformer`, `coverage_profile` | Internal model / encoder |
| `medip_seq` | BED/BED.GZ, peak files, BAM/CRAM, bedGraph/WIG/bigWig | `epibert` | `ntv2`, `dnabert2`, `hyenadna`, `caduceus`, `epcot`, `enformer`, `coverage_profile` | Internal model / encoder |
| `lpwgs` | BED/BED.GZ, BAM/CRAM, `cnv_parquet`, bedGraph/WIG/bigWig | `lpwgs_cnv_profile` | `coverage_profile`, `ntv2`, `dnabert2`, `hyenadna`, `caduceus`, `epibert`, `epcot`, `enformer` | Internal model / encoder |
| `ulpwgs` | BED/BED.GZ, BAM/CRAM, `cnv_parquet`, bedGraph/WIG/bigWig | `lpwgs_cnv_profile` | `coverage_profile`, DNA foundation encoders listed above | Internal model / encoder |
| `ctdna_variant` | VCF/VCF.GZ, MAF/MAF.GZ, MAF TSV | `vcf_signature` | `variant_effect_profile` when CADD, SpliceAI, DeepSEA, or similar effect scores exist | Internal model / encoder |
| `variant` | VCF/VCF.GZ, MAF/MAF.GZ, MAF TSV | `vcf_signature` | `variant_effect_profile` | Internal model / encoder |

## External Method Advisor Registry

| Method/tool | Status | Primary data types | Best used for |
| --- | --- | --- | --- |
| FinaleToolkit | External runtime wrapper | Paired-end cfDNA WGS BAM/CRAM or indexed fragment files | Fragment length, coverage, WPS, DELFI-style features, end motifs, cleavage profiles |
| DELFI-style features | Advisory/internal proxy | Low-pass paired-end cfDNA WGS fragments | Genomewide fragmentome features and cancer-monitoring style feature matrices |
| cfDNAPro | Advisory external | Paired-end cfDNA WGS BAM in R/Bioconductor workflows | Robust fragment curation, fragment-length metrics, motif-oriented summaries |
| Griffin | Advisory external | cfDNA WGS around predefined loci | Nucleosome profiling, tissue-of-origin and accessibility-style follow-up |
| LIQUORICE | Advisory external | cfDNA WGS BAM plus BED regions | Bias-corrected region-centered coverage changes |
| LBFextract | Advisory external | cfDNA WGS BAM plus region/BED sets | Regulatory-region fragmentomics and coverage/fragment-length feature extraction |
| cfDNApipe | Advisory external | cfDNA WGS/WGBS FASTQ or BAM | Broad external WGS/WGBS QC, CNV, DMR, and fragment-size workflows |
| cfDNA UniFlow | External runtime wrapper | cfDNA WGS FASTQ/BAM plus workflow configuration | Standardized WGS preprocessing, QC, GC-bias correction, copy-number state estimation, and region signal extraction |
| cfDNAFE | External runtime wrapper | cfDNA WGS/WGBS intermediate files or fragment files | Multi-signal feature extraction across fragmentation, WPS, OCF, CNV, and methylation-derived features |
| cfDNAanalyzer | External method guidance | cfDNA sequencing BAM manifests | CNA, end-motif, footprinting, nucleosome, WPS, OCF, and promoter-fragmentation-entropy feature matrices |
| EMIT | External runtime wrapper / research | cfDNA end-motif tables | Transformer-based end-motif representation learning and linear-probe cancer-detection experiments |
| DeepFRAG | External runtime wrapper / watchlist | cfDNA fragment-size distributions with labels | Deep fragment-size probability modeling for supervised cancer-detection experiments |
| ichorCNA | Advisory external | ULP-WGS/LPWGS cfDNA WIG/read-count bins | Tumor fraction and broad copy-number alteration inference |
| QDNAseq | Advisory external | Shallow WGS / LPWGS BAM files | Binning, correction, segmentation, and copy-number calling |
| WisecondorX | Advisory external | Shallow WGS / cfDNA low-pass WGS BAM/CRAM | Reference-based shallow-WGS CNV detection |
| HMMcopy | Advisory external | Windowed WGS readcounts with GC/mappability tracks | Readcount correction before CNV workflows |
| CNVkit | External runtime wrapper | Targeted DNA, WES, WGS BAM files | Read-depth CNV detection and visualization |
| Control-FREEC | Advisory external | WGS/WES/targeted read depth plus BAF | Copy-number and LOH calling in higher-coverage designs |
| CopywriteR | Reimplementation candidate / legacy with internal `copywriter-proxy` | Targeted or exome off-target reads, interval/bin-count tables | First-pass off-target/bin-count CNV screening when the original archived R/Bioconductor stack is not suitable |
| FACETS / facetsSuite | External runtime wrapper, core FACETS installed separately from pileup resources | Paired tumor-normal WGS/WES/targeted SNP pileups | Allele-specific copy number, purity, ploidy, and LOH |
| PureCN | External runtime wrapper | Targeted short-read DNA or WES BAM/coverage plus optional VCF | Targeted-panel copy number, purity/ploidy, LOH, and SNV classification support |
| BayesCNV | External runtime wrapper / watchlist | Targeted cfDNA panel coverage/features | Bayesian somatic amplification detection in low-tumor-content targeted cfDNA settings |
| QSEA | Advisory external | MeDIP/cfMeDIP enrichment BAM and windows | Methylation-enrichment modeling using CpG density and calibration assumptions |
| MEDIPS | Advisory external | MeDIP/cfMeDIP BAM and reference CpG annotations | Methylation-enrichment QC, saturation, CpG coverage, enrichment summaries |
| Bismark | Advisory external | WGBS/RRBS/bisulfite FASTQ | Bisulfite alignment and methylation calling |
| MethylDackel | Advisory external | Aligned bisulfite/EM-seq BAM/CRAM | CpG methylation extraction from alignments |
| nf-core/methylseq | Advisory external | Bisulfite/EM-seq FASTQ samplesheets | Production-style FASTQ-to-report methylation workflow |
| FinaleMe | Advisory external | cfDNA WGS fragmentation-derived features plus FinaleMe resources | Exploratory methylation prediction from cfDNA fragmentation |
| cfTools / cfSort | Advisory external | WGBS/cfMethyl-Seq methylation calls and marker references | Tissue-of-origin, tumor-burden, CancerDetector, cfDeconvolve, cfSort analyses |
| MethylBERT | External runtime wrapper / research | Read-level WGBS or Dorado-called methylation patterns | Transformer-based read classification and methylation deconvolution |
| cfDecon | External runtime wrapper / research source checkout | cfDNA methylation reads or method-specific feature tables | Deep autoencoder-based cell-type deconvolution |
| CelFiE-ISH | External method guidance / research | Single-molecule/read-haplotype methylation data | Haplotype-aware multi-cell-type deconvolution and rare-cell-type detection |
| CelFEER | External runtime wrapper / research source checkout | Read-level cfDNA WGBS methylation | Benchmark-supported read-level methylation deconvolution |
| UXM | External runtime wrapper with binary/resource gaps | Fragment-level methylation states plus atlas resources | Unmethylated-fragment deconvolution of cfDNA tissue fractions |
| MethAtlas | External runtime wrapper / research source checkout | Methylation ratio matrices plus atlas resources | Fast interpretable atlas-based tissue deconvolution |
| cfNOMe | External runtime wrapper / research source checkout | NOMe/cfNOMe-compatible methylation outputs | Tissue-of-origin deconvolution plus nucleosome occupancy summaries |
| MetDecode | External runtime wrapper / research | Marker-region methylated/total CpG counts | Methylation-based cfDNA deconvolution for multi-cancer typing |
| CpGPT / MethylGPT / MethFormer | Mixed: CpGPT/MethylGPT runtime wrappers; MethFormer model-resource guidance | Methylation matrices or regional methylation tensors | Foundation-model embeddings, imputation, and transfer-learning experiments |
| cfMethylPre | Advisory literature watchlist | cfDNA methylation profiles plus sequence embeddings | Transfer-learning cancer-detection model concept |
| Dorado + modkit | External runtime wrapper for modkit; Dorado remains explicit system/model resource | Nanopore cfDNA POD5/FAST5 or modified-base BAM | Modified-base calling and methylation coordinate extraction |
| fgbio | Advisory external | UMI-tagged targeted sequencing BAM/FASTQ | UMI consensus preprocessing before low-VAF variant calling |
| Mutect2 / LoFreq / VarDict | Advisory external | Targeted, WES, or cfDNA BAM/CRAM | Low-VAF ctDNA SNV/indel calling |
| Salmon / STAR / featureCounts | Advisory external | cfRNA FASTQ or count matrices | cfRNA quantification and expression matrix generation |
| sRNAbench / miRge-style routes | Advisory external | Small-RNA FASTQ or miRNA count matrices | EV-miRNA or plasma small-RNA profiling |
| Scanpy / Seurat / CellTypist-style downstream routes | Advisory external | CTC count tables, marker matrices, h5ad/RDS-style outputs | CTC table and single-cell expression interpretation |
| DIA-NN / MaxQuant / OpenMS-style upstream routes | Advisory external | mzML/vendor raw files or protein/peptide abundance matrices | Plasma or extracellular-vesicle proteomics preprocessing and matrix-level review |

## LLM Engines For Agent Interaction

These engines are used for natural-language understanding and user assistance. They do not replace the deterministic legality checks, method registry, or local analysis code.

| Backend | Selection | Use |
| --- | --- | --- |
| OpenAI GPT | `auto` (currently `gpt-6-luna`) | Default economical tier |
| OpenAI GPT | `gpt-6-sol` | Explicit advanced tier |
| OpenAI GPT | `gpt-6-astra` | Explicit flagship tier |
| Offline diagnostics | `/llm off` | No model calls; not conversational intelligence |

The same adapter handles user messages, domain context, task and result summaries.
See [OpenAI configuration](../guides/openai-configuration.md) for the current policy.

## Practical Reading Order

- Use this page for a global capability inventory.
- Use [Blood-Signal Encoding](../guides/blood-encoding.md) for encoder defaults and accepted input formats.
- Use [Liquid-Biopsy Method Advisor](liquid-biopsy-methods.md) for external method selection details and references.
- Use [CLI Entrypoints](cli.md) or [Python API](python-api.md) for reproducible command/API calls.

## Current Web interaction guide

For the current interaction model and screenshots, use the [workspace walkthrough](../getting-started/workspace-walkthrough.md), [image/result controls](../guides/images-and-result-actions.md) and [reviewed skills](../guides/professional-skills.md). They distinguish inspection, proposed follow-up, authorized execution and reviewed preferences.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 液体活检能力矩阵（中文）

本页统一概览当前面向用户的 Liquid Agent 能力，将可调用模型、工具、方法和工作流模块映射到它们处理的液体活检数据类型。

## 状态含义

| 状态 | 含义 |
| --- | --- |
| 内部可执行 | 所需输入存在时，Liquid Agent 可以通过 Python 内核、脚本、Shell、Web API 或自动执行来运行该功能。 |
| 内部模型/编码器 | 模型或确定性编码器已在血液信号编码层注册。 |
| 外部运行时封装 | Liquid Agent 可以通过 `liquid-agent tools` 检查、在可行时安装/准备、冒烟测试和调用该运行时。真实分析仍可能需要模型文件、参考资源、清单或兼容输入文件。 |
| 外部方法指引 | 方法顾问可以推荐该方法、展示要求并选择内部备用方案，但尚未注册稳定的本地封装。 |
| 重新实现候选 | 原方法有用，但公共运行时过旧或不稳定，不适合普通用户；优先考虑未来的小型内部代理实现或仍受维护的替代方案。 |
| LLM 引擎 | 用于对话、辅助规划、文档上下文、结果解释和恢复建议，不是生物医学信号模型。 |

## 最近新增的内核功能

| 功能 | 状态 | 数据或问题类型 | 用户入口 |
| --- | --- | --- | --- |
| 液体活检方法顾问注册表 | 内部可执行 | 片段组学、甲基化、拷贝数、变异、cfRNA、小 RNA、CTC 表格和蛋白质组学的方法/工具问题 | `/methods`、`liquid-agent methods`、`scripts/run_liquid_biopsy_method_advisor.py`、Web Method advice 按钮、Python API |
| 指定工具排名 | 内部可执行 | 明确提及 cfDNAPro、WisecondorX、FinaleMe 或 cfTools 等工具的问题 | 自然语言、`/methods`、CLI、Web API |
| 依赖和手动资源状态 | 内部可执行 | 需要可执行程序、R 包、Python 模块、Java、参考面板、模型文件或代码包的外部方法 | 方法建议 JSON/Markdown 报告 |
| 外部运行时管理器 | 内部可执行 | 选定的内核外 Python、R/Bioconductor、源码、Snakemake 和系统二进制工具 | `liquid-agent tools status/install/smoke/run`、外部工具状态报告 |
| 已提供信号矩阵分析 | 内部可执行 | 已处理 CNV、甲基化、EPIC 类甲基化/未甲基化矩阵，或其他液体活检数值矩阵 | `scripts/run_cfdna_analysis_suite.py`、`scripts/run_cfdna_plot_suite.py`、`/plan`、`/autopilot`、Web 结果 |
| 元数据概况扫描器 | 内部可执行 | CSV、TSV、Excel、Parquet、JSON、JSONL 和 NDJSON 元数据或标签表 | `/metadata`、Web Metadata 卡片、Web 扫描/规划响应、规划器输入 |
| 标签感知规划 | 内部可执行 | 有候选样本标签、分组、响应/状态列或用户选定标签的数据集 | `/plan`、`/metadata use`、Web Change/Ignore 控件；选择无监督、分组或探索性监督模式 |
| 探索性监督建模 | 后端可用时内部可执行 | 具有足够匹配标签的带标签特征存储、嵌入或已处理信号矩阵 | 标准 cfDNA 分析任务；默认 `sklearn_logistic_regression`，较大带标签队列可选 `pytorch_linear_probe` |
| Markdown 优先结果报告 | 内部可执行 | 已完成运行、生成表格、静态图形、方法建议报告和结果评估 | Web Results 面板、`liquid-agent results`、自动执行报告；默认隐藏后端 JSON/TXT/HTML 冗余产物 |
| 智能体规划集成 | 内部可执行 | 含候选血液原始数据、片段组学输出、CNV 输入、覆盖度轨道、变异输入、区域信号表或浏览器轨道类输入的数据集目录 | `/plan`、`/autopilot`、Web 扫描/规划 |
| LiquidBiopsyDataState 摘要 | 内部可执行 | 任意已扫描液体活检数据源或生成结果集合 | 后端规划器、结果评估器、计划台账、自动执行报告；记录信号类型、输入/输出计数、元数据覆盖率、最低输出契约缺口、阻塞和安全后续操作，不增加用户控件 |
| 液体活检 FeatureBook 契约 | 内部可执行 | 片段组学、甲基化、拷贝数、变异、已提供矩阵、压缩包和元数据/分组比较上下文 | 规划器、结果评估器、计划台账、自动执行报告、Python API；跟踪预期产物、QC 检查、解释限制和已满足/待完成契约状态 |
| ToolCard 输出类型验证 | 内部可执行 | 已完成的后端任务和外部封装任务摘要 | 执行器、计划台账、自动执行报告；验证摘要、表格、图形、方法建议报告、审阅或特征存储等最低输出类型；单独输出目录不视为完成，但会抽查并统计已报告输出/运行目录中的真实结果文件 |
| 内容提取结果信号 | 内部可执行 | 液体活检运行生成的排序效应表、分组摘要、标签指标摘要、样本离群点表和摘要 JSON | 结果评估器、规划说明、计划台账、自动执行报告；可提升已就绪可视化、原始信号后续分析、信号感知方法建议或审阅任务的优先级，不增加用户控件 |
| 结果驱动分析概念 | 内部可执行 | 内容提取的液体活检结果信号和 FeatureBook 契约 | 结果评估器、规划说明、计划台账、自动执行报告；将真实证据转换为有优先级且可审计的后续问题、建议任务类型、QC 检查、解释限制和稳定新颖性键，不增加用户控件 |
| 方法建议内部备用路由 | 内部可执行 | 包含优先方法、资源限制和内部备用路径的方法建议 JSON | 规划器和计划台账；可将备用证据映射回已就绪的标准 cfDNA 分析、标准可视化、原始信号分析或原始信号可视化，不增加用户控件 |
| 感知数据源的 Web 方法建议 | 内部可执行 | 单源或多源 Web 会话 | `POST /api/session/{session_id}/methods/advice` |
| 不完整候选输入的规划稳健性 | 内部可执行 | 候选文件不完整、尚不能安全规划编码的目录 | 继续规划可行任务并记录说明，而不是崩溃 |
| 方法建议文档和提示词示例 | 文档 | 自然语言示例和可复现命令形式 | README、文档站点、脚本手册 |

## 直接内部工作流模块

### 显式检测契约

这些操作使用经过验证的 `*.assay.json` 声明或控制器的 `configure_assay` 工具，不会仅凭文件名推断，也不会因为加载技能就自动启动。参见[结构定义与限制](../guides/assay-tables.md)。

| 操作 | 已实现引擎 | 边界 |
| --- | --- | --- |
| 数字 PCR 已接受分区 | 占据率浓度和变换后的精确二项分布 95% 区间 | 不进行原始液滴门控、双重检测拟合或临床检出阈值判定 |
| CTC 已接受计数/体积 | 每 mL 细胞数和精确泊松 95% 区间 | 不进行基于图像的身份判定或富集校正 |
| RNA、蛋白质、代谢物和 EV 已处理矩阵 | 缺失情况、分布、样本/特征 QC、有界 PCA 和热图 | 不进行原始仪器信号鉴定或生物来源验证 |
| 甲基化 beta 矩阵 | 范围验证、缺失情况和样本/探针展示 | 不进行 IDAT 归一化、转化 QC 或 DMR 拟合 |
| 独立组 RNA 原始计数 | PyDESeq2、Wald 检验和校正后的 p 值 | 需要单独明确请求；不支持配对/批次/时间设计；需要实验重复 |

每项完成的操作都会产生 Markdown 报告、真实 PNG/CSV 输出和来源记录。可选依赖在使用时检查。

### 现有工作流模块

| 工作流模块 | 状态 | 主要数据类型 | 主要入口 | 典型输出 |
| --- | --- | --- | --- | --- |
| 数据集/数据源扫描 | 内部可执行 | 目录、文件、多个已附加液体活检数据源 | `/use`、`/sources`、Web 数据源管理器、`scan_project_profile(...)` | 检测到的信号候选、标签、输出和数据源清单 |
| 血液信号预处理 | 内部可执行 | BED/BED.GZ、峰文件、BAM/CRAM、VCF/MAF、CSV/TSV/parquet 变异表 | `/preprocess` 风格自然语言、自动执行、`scripts/preprocess_*_signal.py`、Python API | 清理后的区间、区域信号表、分箱计数、分段、染色体臂负荷、规范化变异表和摘要 |
| 血液信号编码 | 内部可执行 | cfChIP/cfMeDIP/MeDIP 区间或比对文件、LPWGS/ULPWGS 区间或 CNV 表、VCF/MAF 变异表、连续轨道 | `/blood`、自然语言、`scripts/encode_*_features.py`、Python API | 特征存储、编码器摘要和可复用样本向量 |
| 标准 cfDNA 分析 | 内部可执行 | 特征存储、片段组学摘要、甲基化代理表、CNV 目录、区域信号表、已提供 CNV/甲基化/信号矩阵、标签 | `scripts/run_cfdna_analysis_suite.py`、自动执行、Python API | 距离/相关性/离群点摘要、分组指标、已提供矩阵摘要和模块摘要 |
| 标准 cfDNA 可视化 | 内部可执行 | 特征存储、元数据/标签、片段组学摘要、甲基化代理表、CNV 目录、已提供 CNV/甲基化/信号矩阵 | `scripts/run_cfdna_plot_suite.py`、自动执行、Python API | UMAP/t-SNE/PCA 散点图、热图、分组图、已提供矩阵 PNG 输出、Markdown 报告静态图形，以及 Python 可选 Plotly HTML 文件 |
| 原始信号可视化 | 内部可执行 | 片段目录、CNV/分箱目录、覆盖度轨道、区域信号表、变异输入、末端基序表、位点表 | `scripts/run_cfdna_raw_signal_suite.py`、自动执行、Python API | 片段长度图、全基因组概况、样本/分箱热图、区域元曲线、VAF 图、基序图、浏览器轨道清单，以及 Python 可选 Plotly HTML 文件 |
| 原始信号数值分析 | 内部可执行 | 片段目录、CNV/分箱目录、覆盖度轨道、区域信号表、变异输入、末端基序表、样本时间表、浏览器轨道文件 | `scripts/run_cfdna_raw_signal_analysis_suite.py`、自动执行、Python API | 片段组学指标、CNV 摘要、染色体臂负荷、VAF 摘要、纵向摘要、浏览器轨道摘要和数值报告 JSON |
| 方法/工具建议 | 内部可执行 | 数据集目录和自然语言方法问题 | `/methods`、CLI、Web API、Python API | `liquid_biopsy_method_advice.json`、`liquid_biopsy_method_advice.md` |
| 结果审阅和报告摘要 | 内部可执行 | 已有 Liquid Agent 输出和报告 | `/review`、自动执行最终阶段、Python API | 汇总审阅 JSON/TXT 和后续操作 |
| 闭环智能体台账和结果评估 | 内部可执行 | 数据集扫描、生成摘要、内容提取结果信号、结果驱动分析概念、待执行/已行动/受阻概念生命周期记录、方法建议内容、表格、图形、报告、失败和运行记录 | `/plan`、`/autopilot`、Web 计划/运行/结果、`PlanLedger`、`PlanLedger.concept_memory()`、`PlanLedger.write_concept_book()`、`evaluate_project_results(...)` | `assistant/ledger/plan_*.json`、`run_*.json`、`result_evaluation_*.json`、`analysis_concept_book.json`、规划证据说明、计划级概念记忆快照和差异、概念验证和阻塞状态、基于概念记忆的后续操作、审计式自动执行报告 |
| 基于 FeatureBook 的信号验证 | 内部可执行 | 常见液体活检信号类型和生成产物 | 内部规划器/评估器、`list_feature_specs(...)`、`compile_user_analysis_idea(...)` | 特征契约、编译后的用户想法、计划新颖性证据和报告级已满足/待完成状态 |
| 专业技能记忆和工作流契约 | 内部可执行 | Markdown、文本、运行时支持的 PDF、URL、目录、专家笔记、`workflow.yaml` 操作手册 | `/skills`、`/skills explain-plan`、Web 技能端点、Python API | 技能文档、技能缓存、工作流触发条件、必需输出、质量检查和未来规划使用的上下文片段 |

## 预处理配置

| 信号类型 | 支持的输入 | 默认配置 | 其他可调用配置 | 主要数据产物 |
| --- | --- | --- | --- | --- |
| `cfchip_seq` | BED/BED.GZ、narrowPeak/broadPeak/gappedPeak、BAM/CRAM | `cfchip_interval_cleanup` | `cfchip_panel_summary`、`cfchip_background_aware` | 清理后的区间、可选区域面板摘要、可选背景归一化摘要 |
| `cfmedip_seq` | BED/BED.GZ、narrowPeak/broadPeak/gappedPeak、BAM/CRAM | `cfmedip_interval_cleanup` | `cfmedip_panel_summary`、`cfmedip_scale_normalized_panel` | 清理后的区间、甲基化面板摘要、可选尺度归一化摘要 |
| `medip_seq` | BED/BED.GZ、narrowPeak/broadPeak/gappedPeak、BAM/CRAM | `medip_interval_cleanup` | `medip_panel_summary`、`medip_scale_normalized_panel` | 与 cfMeDIP 类甲基化富集相同的路径 |
| `lpwgs` | BED/BED.GZ、BAM/CRAM | `lpwgs_interval_cleanup` | `lpwgs_cleanup_only`、`lpwgs_gc_corrected` | 清理后的区间、全基因组分箱、有注释时的校正分箱、分段和染色体臂负荷 |
| `ulpwgs` | BED/BED.GZ、BAM/CRAM | `ulpwgs_interval_cleanup` | `ulpwgs_cleanup_only`、`ulpwgs_gc_corrected` | 与 LPWGS 相同的路径，针对超低深度数据调整 |
| `ctdna_variant` | VCF/VCF.GZ、MAF/MAF.GZ、MAF TSV、CSV/TSV/parquet 表 | `variant_table_qc` | `variant_strict_somatic`、`variant_matched_normal` | 规范化变异表、保守过滤，以及提供匹配正常样本时的重叠过滤 |
| `variant` | VCF/VCF.GZ、MAF/MAF.GZ、MAF TSV、CSV/TSV/parquet 表 | `variant_table_qc` | `variant_strict_somatic`、`variant_matched_normal` | 与 ctDNA 变异预处理相同的路径 |

## 内部编码器和模型

| 信号类型 | 数据类型 | 默认编码器/模型 | 可选编码器/模型 | 状态 |
| --- | --- | --- | --- | --- |
| `cfchip_seq` | BED/BED.GZ、峰文件、BAM/CRAM、bedGraph/WIG/bigWig | `ntv2` | `dnabert2`、`hyenadna`、`caduceus`、`epibert`、`epcot`、`enformer`、`coverage_profile` | 内部模型/编码器 |
| `cfmedip_seq` | BED/BED.GZ、峰文件、BAM/CRAM、bedGraph/WIG/bigWig | `epibert` | `ntv2`、`dnabert2`、`hyenadna`、`caduceus`、`epcot`、`enformer`、`coverage_profile` | 内部模型/编码器 |
| `medip_seq` | BED/BED.GZ、峰文件、BAM/CRAM、bedGraph/WIG/bigWig | `epibert` | `ntv2`、`dnabert2`、`hyenadna`、`caduceus`、`epcot`、`enformer`、`coverage_profile` | 内部模型/编码器 |
| `lpwgs` | BED/BED.GZ、BAM/CRAM、`cnv_parquet`、bedGraph/WIG/bigWig | `lpwgs_cnv_profile` | `coverage_profile`、`ntv2`、`dnabert2`、`hyenadna`、`caduceus`、`epibert`、`epcot`、`enformer` | 内部模型/编码器 |
| `ulpwgs` | BED/BED.GZ、BAM/CRAM、`cnv_parquet`、bedGraph/WIG/bigWig | `lpwgs_cnv_profile` | `coverage_profile`、上面列出的 DNA 基础编码器 | 内部模型/编码器 |
| `ctdna_variant` | VCF/VCF.GZ、MAF/MAF.GZ、MAF TSV | `vcf_signature` | 存在 CADD、SpliceAI、DeepSEA 或类似效应得分时使用 `variant_effect_profile` | 内部模型/编码器 |
| `variant` | VCF/VCF.GZ、MAF/MAF.GZ、MAF TSV | `vcf_signature` | `variant_effect_profile` | 内部模型/编码器 |

## 外部方法顾问注册表

| 方法/工具 | 状态 | 主要数据类型 | 最适用途 |
| --- | --- | --- | --- |
| FinaleToolkit | 外部运行时封装 | 双端 cfDNA WGS BAM/CRAM 或已索引片段文件 | 片段长度、覆盖度、WPS、DELFI 类特征、末端基序和切割概况 |
| DELFI 类特征 | 建议/内部代理 | 低深度双端 cfDNA WGS 片段 | 全基因组片段组特征和癌症监测类特征矩阵 |
| cfDNAPro | 外部方法建议 | R/Bioconductor 工作流中的双端 cfDNA WGS BAM | 稳健片段整理、片段长度指标和基序相关摘要 |
| Griffin | 外部方法建议 | 预定义位点附近的 cfDNA WGS | 核小体概况、组织来源和可及性类后续分析 |
| LIQUORICE | 外部方法建议 | cfDNA WGS BAM 和 BED 区域 | 偏倚校正的区域中心覆盖度变化 |
| LBFextract | 外部方法建议 | cfDNA WGS BAM 和区域/BED 集合 | 调控区域片段组学，以及覆盖度/片段长度特征提取 |
| cfDNApipe | 外部方法建议 | cfDNA WGS/WGBS FASTQ 或 BAM | 综合外部 WGS/WGBS QC、CNV、DMR 和片段长度工作流 |
| cfDNA UniFlow | 外部运行时封装 | cfDNA WGS FASTQ/BAM 和工作流配置 | 标准化 WGS 预处理、QC、GC 偏倚校正、拷贝数状态估计和区域信号提取 |
| cfDNAFE | 外部运行时封装 | cfDNA WGS/WGBS 中间文件或片段文件 | 片段化、WPS、OCF、CNV 和甲基化衍生特征的多信号提取 |
| cfDNAanalyzer | 外部方法指引 | cfDNA 测序 BAM 清单 | CNA、末端基序、足迹、核小体、WPS、OCF 和启动子片段化熵特征矩阵 |
| EMIT | 外部运行时封装/研究 | cfDNA 末端基序表 | 基于 Transformer 的末端基序表征学习和线性探针癌症检测实验 |
| DeepFRAG | 外部运行时封装/关注清单 | 带标签的 cfDNA 片段长度分布 | 用于监督癌症检测实验的深度片段长度概率建模 |
| ichorCNA | 外部方法建议 | ULP-WGS/LPWGS cfDNA WIG/读取计数分箱 | 肿瘤分数和大范围拷贝数改变推断 |
| QDNAseq | 外部方法建议 | 浅层 WGS / LPWGS BAM 文件 | 分箱、校正、分段和拷贝数检测 |
| WisecondorX | 外部方法建议 | 浅层 WGS / cfDNA 低深度 WGS BAM/CRAM | 基于参考的浅层 WGS CNV 检测 |
| HMMcopy | 外部方法建议 | 带 GC/可比对性轨道的窗口化 WGS 读取计数 | CNV 工作流前的读取计数校正 |
| CNVkit | 外部运行时封装 | 靶向 DNA、WES、WGS BAM 文件 | 读取深度 CNV 检测和可视化 |
| Control-FREEC | 外部方法建议 | WGS/WES/靶向读取深度和 BAF | 较高覆盖度设计中的拷贝数和 LOH 检测 |
| CopywriteR | 重新实现候选/旧版，提供内部 `copywriter-proxy` | 靶向或外显子脱靶读段、区间/分箱计数表 | 原归档 R/Bioconductor 软件栈不适合时的首轮脱靶/分箱计数 CNV 筛查 |
| FACETS / facetsSuite | 外部运行时封装，核心 FACETS 与 pileup 资源分别安装 | 配对肿瘤-正常 WGS/WES/靶向 SNP pileup | 等位基因特异性拷贝数、纯度、倍性和 LOH |
| PureCN | 外部运行时封装 | 靶向短读长 DNA 或 WES BAM/覆盖度，可选 VCF | 靶向面板拷贝数、纯度/倍性、LOH 和 SNV 分类支持 |
| BayesCNV | 外部运行时封装/关注清单 | 靶向 cfDNA 面板覆盖度/特征 | 低肿瘤含量靶向 cfDNA 条件下的贝叶斯体细胞扩增检测 |
| QSEA | 外部方法建议 | MeDIP/cfMeDIP 富集 BAM 和窗口 | 基于 CpG 密度和校准假设的甲基化富集建模 |
| MEDIPS | 外部方法建议 | MeDIP/cfMeDIP BAM 和参考 CpG 注释 | 甲基化富集 QC、饱和度、CpG 覆盖度和富集摘要 |
| Bismark | 外部方法建议 | WGBS/RRBS/亚硫酸氢盐 FASTQ | 亚硫酸氢盐比对和甲基化检测 |
| MethylDackel | 外部方法建议 | 已比对的亚硫酸氢盐/EM-seq BAM/CRAM | 从比对文件提取 CpG 甲基化 |
| nf-core/methylseq | 外部方法建议 | 亚硫酸氢盐/EM-seq FASTQ 样本表 | 生产级 FASTQ 到报告的甲基化工作流 |
| FinaleMe | 外部方法建议 | cfDNA WGS 片段化衍生特征和 FinaleMe 资源 | 从 cfDNA 片段化进行探索性甲基化预测 |
| cfTools / cfSort | 外部方法建议 | WGBS/cfMethyl-Seq 甲基化结果和标记参考 | 组织来源、肿瘤负荷、CancerDetector、cfDeconvolve、cfSort 分析 |
| MethylBERT | 外部运行时封装/研究 | 读段级 WGBS 或 Dorado 检测的甲基化模式 | 基于 Transformer 的读段分类和甲基化去卷积 |
| cfDecon | 外部运行时封装/研究源码检出 | cfDNA 甲基化读段或方法特定特征表 | 基于深度自编码器的细胞类型去卷积 |
| CelFiE-ISH | 外部方法指引/研究 | 单分子/读段单倍型甲基化数据 | 考虑单倍型的多细胞类型去卷积和稀有细胞类型检测 |
| CelFEER | 外部运行时封装/研究源码检出 | 读段级 cfDNA WGBS 甲基化 | 有基准测试支持的读段级甲基化去卷积 |
| UXM | 外部运行时封装，存在二进制/资源缺口 | 片段级甲基化状态和图谱资源 | 基于未甲基化片段的 cfDNA 组织比例去卷积 |
| MethAtlas | 外部运行时封装/研究源码检出 | 甲基化比例矩阵和图谱资源 | 快速、可解释的基于图谱的组织去卷积 |
| cfNOMe | 外部运行时封装/研究源码检出 | NOMe/cfNOMe 兼容甲基化输出 | 组织来源去卷积和核小体占据摘要 |
| MetDecode | 外部运行时封装/研究 | 标记区域甲基化/总 CpG 计数 | 用于多癌种分类的甲基化 cfDNA 去卷积 |
| CpGPT / MethylGPT / MethFormer | 混合：CpGPT/MethylGPT 运行时封装；MethFormer 模型资源指引 | 甲基化矩阵或区域甲基化张量 | 基础模型嵌入、插补和迁移学习实验 |
| cfMethylPre | 文献建议关注清单 | cfDNA 甲基化概况和序列嵌入 | 迁移学习癌症检测模型概念 |
| Dorado + modkit | modkit 有外部运行时封装；Dorado 仍是需明确提供的系统/模型资源 | Nanopore cfDNA POD5/FAST5 或修饰碱基 BAM | 修饰碱基检测和甲基化坐标提取 |
| fgbio | 外部方法建议 | 带 UMI 标签的靶向测序 BAM/FASTQ | 低 VAF 变异检测前的 UMI 共识预处理 |
| Mutect2 / LoFreq / VarDict | 外部方法建议 | 靶向、WES 或 cfDNA BAM/CRAM | 低 VAF ctDNA SNV/indel 检测 |
| Salmon / STAR / featureCounts | 外部方法建议 | cfRNA FASTQ 或计数矩阵 | cfRNA 定量和表达矩阵生成 |
| sRNAbench / miRge 类路径 | 外部方法建议 | 小 RNA FASTQ 或 miRNA 计数矩阵 | EV-miRNA 或血浆小 RNA 概况分析 |
| Scanpy / Seurat / CellTypist 类下游路径 | 外部方法建议 | CTC 计数表、标记矩阵、h5ad/RDS 类输出 | CTC 表格和单细胞表达解释 |
| DIA-NN / MaxQuant / OpenMS 类上游路径 | 外部方法建议 | mzML/厂商原始文件或蛋白质/肽段丰度矩阵 | 血浆或细胞外囊泡蛋白质组学预处理和矩阵层面审阅 |

## 智能体交互 LLM 引擎

这些引擎用于自然语言理解和用户辅助，不替代确定性的合法性检查、方法注册表或本地分析代码。

| 后端 | 选择 | 用途 |
| --- | --- | --- |
| OpenAI GPT | `auto`（当前为 `gpt-6-luna`） | 默认经济档 |
| OpenAI GPT | `gpt-6-sol` | 明确选择的高级档 |
| OpenAI GPT | `gpt-6-astra` | 明确选择的旗舰档 |
| 离线诊断 | `/llm off` | 不调用模型；不提供智能对话 |

同一个适配器处理用户消息、领域上下文、任务摘要和结果摘要。当前策略参见 [OpenAI 配置](../guides/openai-configuration.md)。

## 建议阅读顺序

- 使用本页了解完整能力清单。
- 使用[血液信号编码](../guides/blood-encoding.md)了解编码器默认设置和可接受输入格式。
- 使用[液体活检方法顾问](liquid-biopsy-methods.md)了解外部方法选择细节和参考资料。
- 使用 [CLI 入口](cli.md)或 [Python API](python-api.md)查阅可复现的命令/API 调用。

## 当前 Web 交互指南

具体交互方式和截图见[工作区图文操作](../getting-started/workspace-walkthrough.md)、[图片与结果按钮](../guides/images-and-result-actions.md)、[技能审阅](../guides/professional-skills.md)，明确区分查看、提出后续建议、授权执行和审阅偏好。
