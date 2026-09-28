<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Liquid-Biopsy Method Advisor

The method advisor helps users choose liquid-biopsy analysis tools for a dataset or a research question, including mature tools, external runtimes, and explicitly marked research/watchlist methods. It is not a black-box classifier. It compares the detected input files, the user's goal, local dependency availability, external runtime status, and safe internal fallback routes.

For the complete project-wide inventory of callable internal workflows, encoders, external runtimes, LLM engines, and supported data types, see [Capability Matrix](capability-matrix.md). For install/smoke/run details, see [External Tool Runtimes](external-tool-runtimes.md).

Use it when the question is about analysis methods, algorithms, external tools, or assay-specific routes such as fragmentomics, methylation, copy-number analysis, variant calling, cfRNA, small RNA, CTC tables, or plasma proteomics.

## How To Use It

Interactive shell:

```text
/methods fragmentomics CNV methylation
/methods check low-pass cfDNA WGS copy number
/methods run which tools should I use for cfMeDIP and fragmentomics?
```

Natural language:

```text
What mature tools should I consider for fragmentomics, methylation, and CNV in this dataset?
```

```text
Check whether this folder is better suited for cfDNAPro, FinaleToolkit, WisecondorX, QSEA, Bismark, cfTools, or variant calling.
```

CLI:

```bash
liquid-agent methods --input <dataset_or_subdir> --query "fragmentomics CNV methylation"
```

Write a JSON and Markdown report:

```bash
liquid-agent methods \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output-dir <output_dir>
```

Script form:

```bash
python scripts/run_liquid_biopsy_method_advisor.py \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output_dir <output_dir>
```

Python API:

```python
from liquidbiopsy_agent.methods import recommend_liquid_biopsy_methods, write_method_advice_report

advice = recommend_liquid_biopsy_methods(
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
summary = write_method_advice_report(
    output_dir="<output_dir>",
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
```

Local web API:

- `GET /api/methods?query=fragmentomics%20CNV%20methylation`
- `POST /api/session/{session_id}/methods/advice`

## What The Report Contains

The advisor writes:

- `liquid_biopsy_method_advice.json`
- `liquid_biopsy_method_advice.md`

The report includes:

- matched method names and scores
- why each method was selected
- expected input files
- expected outputs
- local dependency status
- install hints for missing optional tools
- safe internal fallback routes
- references for each method family

The output is advisory. It does not claim that an external method has run unless a later execution task actually runs it.

## External Runtime Layer

For selected tools, the method advisor is connected to the external runtime manager. The same tool status is available through:

```bash
liquid-agent tools status
liquid-agent tools status --tool purecn --json
liquid-agent tools install purecn --execute
liquid-agent tools smoke purecn
```

The advisor uses this runtime status in method output:

- `external_runtime_ready`: runtime and required resources are present
- `external_runtime_installed`: the runtime, source checkout, executable, Python module, or R package is locally present and no method-specific missing resource is currently reported
- `external_runtime_needs_resources`: part of the runtime is installed, but real analysis still needs data, model, reference, or workflow resources
- `missing_external_tools`: no callable runtime is available
- `reimplementation_candidate`: upstream code is useful but too old or unstable for ordinary users; prefer an internal proxy or a maintained modern alternative

Examples:

- PureCN and FACETS core can be installed into isolated R/conda runtimes, but need coverage tables, normal resources, or SNP pileups for real analysis.
- modkit can be installed and called through the nanopore methylation route, while Dorado basecalling and ONT model resources remain explicit user-provided requirements.
- CopywriteR is tracked as a reimplementation candidate on macOS arm64 because the available conda builds depend on old R/Bioconductor stacks that do not solve cleanly; Liquid Agent includes a conservative internal `copywriter-proxy` for first-pass off-target/bin-count CNV screening.

## Supported Method Families

| Family | Methods tracked | Typical inputs | Internal fallback or current project route |
| --- | --- | --- | --- |
| Fragmentomics | FinaleToolkit, cfDNAPro, DELFI-style features, Griffin, LIQUORICE, LBFextract, cfDNAFE, cfDNAanalyzer, EMIT, DeepFRAG | paired-end cfDNA WGS BAM/CRAM, fragment files, region tables, end-motif/fragment-size matrices | raw-signal numeric and visualization suites; BED cohort pipeline where suitable |
| Broad cfDNA WGS/WGBS workflow | cfDNApipe, cfDNA UniFlow | FASTQ/BAM plus reference resources | modular preprocessing, raw-signal, CNV, and methylation-summary routes when a full external pipeline is unnecessary |
| Copy number | ichorCNA, QDNAseq, WisecondorX, HMMcopy readcount correction, CNVkit, Control-FREEC, CopywriteR, FACETS/facetsSuite, PureCN, BayesCNV | LPWGS/ULPWGS BAM, WIG/read-count bins, CNV tables, higher-coverage WGS/WES/panel BAMs | LPWGS preprocessing, segmentation, arm-burden, CNV summaries, and `copywriter-proxy` for first-pass off-target/bin-count CNV screening |
| Methylation enrichment | QSEA, MEDIPS | cfMeDIP/MeDIP BAM, enrichment windows, CpG resources | epigenomic preprocessing, region-signal summaries, methylation-aware encoding routes |
| Bisulfite / EM-seq / nanopore methylation | Bismark, MethylDackel, nf-core/methylseq, Dorado + modkit | FASTQ, aligned methylation BAM/CRAM, nanopore POD5/FAST5 or modified-base BAM | summarize generated methylation tables after external calling |
| Methylation deconvolution and advanced models | FinaleMe, cfTools/cfSort, MethylBERT, cfDecon, CelFiE-ISH, CelFEER, UXM, MethAtlas, cfNOMe, MetDecode, CpGPT, MethylGPT, MethFormer, cfMethylPre | WGBS/cfMethyl-Seq methylation calls, read-level methylation patterns, marker/reference atlases, methylation matrices | internal methylation summaries and metadata-aware review until compatible external inputs exist |
| ctDNA variants | fgbio UMI consensus, Mutect2, LoFreq, VarDict | UMI-tagged BAM/FASTQ, VCF, MAF, variant tables | variant preprocessing, VAF summaries, effect-profile aggregation when annotations exist |
| cfRNA | Salmon, STAR, featureCounts | cfRNA FASTQ or count matrices | method guidance and supplied-matrix review |
| EV-miRNA / small RNA | sRNAbench, miRge-style routes | small-RNA FASTQ or miRNA count matrices | method guidance and supplied-matrix review |
| CTC tables | Scanpy, Seurat, CellTypist-style downstream analysis | CTC count tables, marker tables, h5ad/RDS outputs | table-level summaries and expert-guided interpretation |
| Plasma or EV proteomics | DIA-NN, MaxQuant, OpenMS-style upstream workflows | mzML/vendor raw files or abundance matrices | supplied-matrix summaries and metadata-aware review |

## Selection Rules

The advisor intentionally separates three questions:

1. **Can Liquid Agent analyze the supplied files directly?**
2. **Which external tools or research methods are appropriate for deeper assay-specific analysis?**
3. **What safe internal route should run now if external dependencies are missing?**

This keeps autopilot practical. For example, if a low-pass cfDNA WGS folder has no configured ichorCNA resources, the agent can still run LPWGS preprocessing and CNV burden summaries, then report ichorCNA as the recommended deeper follow-up rather than pretending that tumor fraction was estimated.

## Agent Integration

The assistant can include method advice in three places:

- planning, when the dataset contains relevant liquid-biopsy file types
- autopilot, when method advice is useful and no report exists yet
- review, when existing outputs should be summarized alongside method recommendations

In an end-to-end run, the method advisor should not block feasible internal analysis. It should document what is mature, what is locally available, what is missing, and what the agent did instead.

## Dependency Semantics

Requirement status values are interpreted conservatively:

- `ready`: required external tools are available locally
- `ready_with_optional_gaps`: required tools exist, optional helpers are missing
- `partial`: at least one requirement is available, but the method is not fully ready
- `missing_external_tools`: external tools are not available locally
- `internal_or_guidance_only`: no external dependency is required for the advisory entry
- `external_runtime_ready`: the external runtime wrapper and required resources are all present
- `external_runtime_installed`: the external runtime wrapper is locally present and no missing method-specific resource is currently reported
- `external_runtime_needs_resources`: the external runtime wrapper or source checkout is present, but method-specific resources are still incomplete

Missing optional tools are not treated as failures. They are reported with install hints and internal fallback routes.

Some methods also need manual resources such as reference panels, model files, or method-specific code bundles. The advisor reports those as incomplete until the user configures them explicitly; it should not mark a method as fully runnable only because a generic runtime such as Java, R, or Python exists locally.

## Cross-Language Execution Guardrails

Many mature liquid-biopsy tools are not Python packages. Liquid Agent therefore treats them as external runtimes unless a dedicated local wrapper is available.

- R/Bioconductor methods such as PureCN and FACETS are handled in isolated conda R runtimes when possible; QDNAseq, HMMcopy, QSEA, MEDIPS, and cfTools remain method-guidance entries until dedicated wrappers are added.
- Command-line tools such as FinaleToolkit, CNVkit, modkit, and Snakemake workflows are checked through executable discovery in their configured runtime.
- Java or manually downloaded methods such as FinaleMe and several atlas/model-based deconvolution tools require explicit `manual_resource` configuration.
- Research models with code/model checkpoints, such as MethylBERT, CpGPT, MethylGPT, cfDecon, CelFEER, UXM, EMIT, and DeepFRAG, can have source/runtime wrappers while still remaining `ready=False` until checkpoints, atlases, and input-format resources are configured. MethFormer is currently model-resource guidance rather than a registered executable wrapper.

This means the agent may recommend an R, Java, Snakemake, or deep-learning method, but it must not claim that the method has run unless the required runtime and method-specific resources are present and an execution task actually invokes it. If those checks fail, the agent should continue with safe internal summaries and report the external method as a follow-up.

## References

- [FinaleToolkit](https://github.com/epifluidlab/FinaleToolkit)
- [FinaleToolkit feature documentation](https://finaletoolkit.readthedocs.io/en/latest/documentation/user_guide/features.html)
- [cfDNAPro GitHub](https://github.com/hw538/cfDNAPro)
- [cfDNAPro Bioconductor vignette](https://www.bioconductor.org/packages/release/bioc/vignettes/cfDNAPro/inst/doc/cfDNAPro.html)
- [DELFI fragmentomics paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC6774252/)
- [Griffin nucleosome profiling paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC9719521/)
- [LIQUORICE documentation](https://liquorice.readthedocs.io/)
- [LBFextract documentation](https://lbf.readthedocs.io/en/latest/)
- [cfDNApipe](https://github.com/XWangLabTHU/cfDNApipe)
- [cfDNA UniFlow](https://github.com/kircherlab/cfDNA-UniFlow)
- [cfDNAFE](https://github.com/Cuiwanxin1998/cfDNAFE)
- [cfDNAanalyzer](https://liymlab.github.io/cfDNAanalyzer/Tutorial/)
- [EMIT](https://github.com/nglaz0v/EMIT)
- [DeepFRAG](https://pmc.ncbi.nlm.nih.gov/articles/PMC12973171/)
- [ichorCNA](https://github.com/broadinstitute/ichorCNA)
- [QDNAseq](https://bioconductor.org/packages/QDNAseq/)
- [WisecondorX](https://github.com/CenterForMedicalGeneticsGhent/WisecondorX)
- [HMMcopy](https://bioconductor.org/packages/release/bioc/html/HMMcopy.html)
- [CNVkit](https://cnvkit.readthedocs.io/)
- [Control-FREEC](https://github.com/BoevaLab/FREEC)
- [CopywriteR](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-015-0617-1)
- [FACETS / facetsSuite](https://github.com/mskcc/facets-suite)
- [PureCN](https://www.bioconductor.org/packages/release/bioc/html/PureCN.html)
- [BayesCNV](https://github.com/Pillar-Biosciences-Inc/BayesCNV)
- [QSEA](https://bioconductor.org/packages/release/bioc/vignettes/qsea/inst/doc/qsea_tutorial.html)
- [Bismark paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC3102221/)
- [MethylDackel](https://github.com/dpryan79/MethylDackel)
- [nf-core/methylseq](https://github.com/nf-core/methylseq)
- [FinaleMe](https://github.com/epifluidlab/FinaleMe)
- [cfTools](https://www.bioconductor.org/packages/release/bioc/html/cfTools.html)
- [MethylBERT](https://github.com/CompEpigen/methylbert)
- [cfDecon](https://github.com/Susanxuan/cfDecon)
- [CelFiE-ISH](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-024-03275-x)
- [CelFEER](https://github.com/pi-zz-a/CelFEER)
- [UXM](https://github.com/nloyfer/UXM_deconv)
- [MethAtlas](https://github.com/nloyfer/meth_atlas)
- [cfNOMe](https://github.com/FlorianErger/cfNOMe)
- [MetDecode](https://github.com/JorisVermeeschLab/MetDecode)
- [CpGPT](https://github.com/lucascamillomd/CpGPT)
- [MethylGPT](https://github.com/albert-ying/MethylGPT)
- [MethFormer](https://huggingface.co/CChahrour/Methformer)
- [cfMethylPre](https://pmc.ncbi.nlm.nih.gov/articles/PMC12206449/)
- [Oxford Nanopore cfDNA methylation protocol note](https://nanoporetech.com/document/requirements/cfDNA-methyl-profile)
- [ctDNA UMI caller benchmark](https://pmc.ncbi.nlm.nih.gov/articles/PMC11370058/)
- [Somatic variant caller review](https://pmc.ncbi.nlm.nih.gov/articles/PMC5852328/)
- [sRNAbench / sRNAtoolbox update](https://pmc.ncbi.nlm.nih.gov/articles/PMC9252802/)
- [EVmiRNA2.0](https://pmc.ncbi.nlm.nih.gov/articles/PMC12807601/)
- [OpenMS](https://www.openms.org/)

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 液体活检方法顾问（中文）

方法顾问帮助用户针对数据集或研究问题选择液体活检分析工具，包括成熟工具、外部运行环境和明确标记的研究/观察列表方法。它不是黑箱分类器，而是比较检测到的输入文件、用户目标、本地依赖可用性、外部环境状态和安全内部回退路径。

项目范围内全部可调用内部工作流、编码器、外部运行环境、LLM 引擎和数据类型见[能力矩阵](capability-matrix.md)。安装/冒烟/运行详情见[外部工具运行环境](external-tool-runtimes.md)。

当问题涉及分析方法、算法、外部工具，或片段组学、甲基化、拷贝数分析、变异检测、cfRNA、小 RNA、CTC 表和血浆蛋白组学等检测专用路径时使用。

## 使用方式

交互式 Shell：

```text
/methods fragmentomics CNV methylation
/methods check low-pass cfDNA WGS copy number
/methods run which tools should I use for cfMeDIP and fragmentomics?
```

自然语言：

```text
What mature tools should I consider for fragmentomics, methylation, and CNV in this dataset?
```

```text
Check whether this folder is better suited for cfDNAPro, FinaleToolkit, WisecondorX, QSEA, Bismark, cfTools, or variant calling.
```

CLI：

```bash
liquid-agent methods --input <dataset_or_subdir> --query "fragmentomics CNV methylation"
```

写入 JSON 和 Markdown 报告：

```bash
liquid-agent methods \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output-dir <output_dir>
```

脚本形式：

```bash
python scripts/run_liquid_biopsy_method_advisor.py \
  --input <dataset_or_subdir> \
  --query "fragmentomics CNV methylation" \
  --output_dir <output_dir>
```

Python API：

```python
from liquidbiopsy_agent.methods import recommend_liquid_biopsy_methods, write_method_advice_report

advice = recommend_liquid_biopsy_methods(
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
summary = write_method_advice_report(
    output_dir="<output_dir>",
    input_path="<dataset_or_subdir>",
    query="fragmentomics CNV methylation",
)
```

本地 Web API：

- `GET /api/methods?query=fragmentomics%20CNV%20methylation`
- `POST /api/session/{session_id}/methods/advice`

## 报告内容

顾问写入：

- `liquid_biopsy_method_advice.json`
- `liquid_biopsy_method_advice.md`

报告包含：

- 匹配方法名称和评分
- 每种方法的选择理由
- 预期输入文件
- 预期输出
- 本地依赖状态
- 缺失可选工具的安装提示
- 安全内部回退路径
- 每个方法家族的参考资料

输出属于建议。除非后续执行任务实际运行了外部方法，否则不声称它已经运行。

## 外部运行环境层

对于选定工具，方法顾问连接外部运行环境管理器。相同工具状态可通过以下命令查看：

```bash
liquid-agent tools status
liquid-agent tools status --tool purecn --json
liquid-agent tools install purecn --execute
liquid-agent tools smoke purecn
```

顾问在方法输出中使用这些运行环境状态：

- `external_runtime_ready`：运行环境及所需资源存在
- `external_runtime_installed`：运行环境、源码检出、可执行文件、Python 模块或 R 包在本地存在，当前未报告方法专用资源缺失
- `external_runtime_needs_resources`：部分运行环境已安装，但真实分析仍需数据、模型、参考或工作流资源
- `missing_external_tools`：无可调用运行环境
- `reimplementation_candidate`：上游代码有用，但对普通用户过旧或不稳定；优先使用内部替代或维护中的现代工具

示例：

- PureCN 和 FACETS core 可安装到隔离 R/conda 环境，但真实分析需要覆盖表、正常样本资源或 SNP pileup。
- modkit 可通过纳米孔甲基化路径安装和调用，Dorado 碱基识别及 ONT 模型资源仍需用户显式提供。
- CopywriteR 在 macOS arm64 环境中被列为重新实现候选，因为可用 conda 构建依赖旧 R/Bioconductor 栈，无法顺利解析；Liquid Agent 包含保守内部 `copywriter-proxy`，用于首轮非靶向区域/分箱计数 CNV 筛查。

## 支持的方法家族

| 家族 | 跟踪方法 | 典型输入 | 内部回退或当前项目路径 |
| --- | --- | --- | --- |
| 片段组学 | FinaleToolkit, cfDNAPro, DELFI-style features, Griffin, LIQUORICE, LBFextract, cfDNAFE, cfDNAanalyzer, EMIT, DeepFRAG | 双端 cfDNA WGS BAM/CRAM、片段文件、区域表、末端基序/片段长度矩阵 | 原始信号数值与可视化套件；适合时的 BED 队列流水线 |
| 广泛 cfDNA WGS/WGBS 工作流 | cfDNApipe, cfDNA UniFlow | FASTQ/BAM 加参考资源 | 不需完整外部流水线时，使用模块化预处理、原始信号、CNV 和甲基化汇总 |
| 拷贝数 | ichorCNA, QDNAseq, WisecondorX, HMMcopy readcount correction, CNVkit, Control-FREEC, CopywriteR, FACETS/facetsSuite, PureCN, BayesCNV | LPWGS/ULPWGS BAM、WIG/read-count 分箱、CNV 表、较高覆盖 WGS/WES/panel BAM | LPWGS 预处理、分段、染色体臂负荷、CNV 汇总，以及首轮非靶向区域/分箱计数筛查 `copywriter-proxy` |
| 甲基化富集 | QSEA, MEDIPS | cfMeDIP/MeDIP BAM、富集窗口、CpG 资源 | 表观基因组预处理、区域信号汇总、甲基化感知编码 |
| 亚硫酸氢盐 / EM-seq / 纳米孔甲基化 | Bismark, MethylDackel, nf-core/methylseq, Dorado + modkit | FASTQ、已比对甲基化 BAM/CRAM、纳米孔 POD5/FAST5 或修饰碱基 BAM | 外部检测后汇总生成的甲基化表 |
| 甲基化去卷积与高级模型 | FinaleMe, cfTools/cfSort, MethylBERT, cfDecon, CelFiE-ISH, CelFEER, UXM, MethAtlas, cfNOMe, MetDecode, CpGPT, MethylGPT, MethFormer, cfMethylPre | WGBS/cfMethyl-Seq 甲基化结果、read 级甲基化模式、标志/参考图谱、甲基化矩阵 | 兼容外部输入就绪前，采用内部甲基化汇总和元数据感知审阅 |
| ctDNA 变异 | fgbio UMI consensus, Mutect2, LoFreq, VarDict | 带 UMI 的 BAM/FASTQ、VCF、MAF、变异表 | 变异预处理、VAF 汇总，注释存在时的效应谱型聚合 |
| cfRNA | Salmon, STAR, featureCounts | cfRNA FASTQ 或计数矩阵 | 方法指导与用户提供矩阵审阅 |
| EV-miRNA / 小 RNA | sRNAbench, miRge-style routes | 小 RNA FASTQ 或 miRNA 计数矩阵 | 方法指导与用户提供矩阵审阅 |
| CTC 表 | Scanpy, Seurat, CellTypist-style downstream analysis | CTC 计数表、标志物表、h5ad/RDS 输出 | 表格级汇总与专家指导解释 |
| 血浆或 EV 蛋白组学 | DIA-NN, MaxQuant, OpenMS-style upstream workflows | mzML/厂商原始文件或丰度矩阵 | 输入矩阵汇总与元数据感知审阅 |

## 选择规则

顾问有意区分三个问题：

1. **Liquid Agent 能否直接分析提供的文件？**
2. **哪些外部工具或研究方法适合更深入的检测专用分析？**
3. **外部依赖缺失时，现在应运行哪条安全内部路径？**

这使自动运行保持实用。例如低深度 cfDNA WGS 文件夹未配置 ichorCNA 资源时，智能体仍可运行 LPWGS 预处理和 CNV 负荷汇总，将 ichorCNA 报告为推荐的深入后续，而不是假装已估算肿瘤比例。

## 智能体集成

助手可在三处纳入方法建议：

- 规划时：数据集包含相关液体活检文件类型
- 自动运行时：方法建议有用且报告尚不存在
- 审阅时：需要将已有输出与方法建议一起总结

端到端运行中，方法顾问不应阻塞可行内部分析。它应记录哪些方法成熟、哪些本地可用、缺什么，以及智能体改做了什么。

## 依赖语义

需求状态值按保守原则解释：

- `ready`：必需外部工具本地可用
- `ready_with_optional_gaps`：必需工具存在，可选辅助工具缺失
- `partial`：至少一项需求可用，但方法尚未完全就绪
- `missing_external_tools`：外部工具本地不可用
- `internal_or_guidance_only`：建议条目不需要外部依赖
- `external_runtime_ready`：外部运行环境包装器和所需资源全部存在
- `external_runtime_installed`：外部包装器在本地存在，当前未报告方法资源缺失
- `external_runtime_needs_resources`：外部包装器或源码检出存在，但方法资源仍不完整

缺少可选工具不视为失败，而是附安装提示和内部回退路径报告。

部分方法还需要参考 panel、模型文件或专用代码包等手动资源。用户显式配置前，顾问将其报告为不完整；不能仅因本地有 Java、R 或 Python 等通用运行环境就标记方法完全可运行。

## 跨语言执行约束

许多成熟液体活检工具不是 Python 包。因此，除非已有专用本地包装器，否则 Liquid Agent 将其视为外部运行环境。

- PureCN、FACETS 等 R/Bioconductor 方法尽可能使用隔离 conda R 环境；QDNAseq、HMMcopy、QSEA、MEDIPS 和 cfTools 在添加专用包装器前仍属方法指导条目。
- FinaleToolkit、CNVkit、modkit 等命令行工具与 Snakemake 工作流通过配置环境中的可执行文件发现来检查。
- FinaleMe 等 Java 或手动下载方法，以及若干图谱/模型去卷积工具，需要显式 `manual_resource` 配置。
- MethylBERT、CpGPT、MethylGPT、cfDecon、CelFEER、UXM、EMIT、DeepFRAG 等具有代码/模型检查点的研究模型，可以已有源码/运行包装器，但在检查点、图谱和输入格式资源就绪前仍为 `ready=False`。MethFormer 当前是模型资源指导，不是注册的可执行包装器。

这意味着智能体可以推荐 R、Java、Snakemake 或深度学习方法，但只有必需运行环境和方法资源存在、且执行任务实际调用后，才可声称已运行。检查失败时，应继续安全内部汇总，并将外部方法作为后续建议。

## 参考资料

- [FinaleToolkit](https://github.com/epifluidlab/FinaleToolkit)
- [FinaleToolkit 特征文档](https://finaletoolkit.readthedocs.io/en/latest/documentation/user_guide/features.html)
- [cfDNAPro GitHub](https://github.com/hw538/cfDNAPro)
- [cfDNAPro Bioconductor 教程](https://www.bioconductor.org/packages/release/bioc/vignettes/cfDNAPro/inst/doc/cfDNAPro.html)
- [DELFI 片段组学论文](https://pmc.ncbi.nlm.nih.gov/articles/PMC6774252/)
- [Griffin 核小体分析论文](https://pmc.ncbi.nlm.nih.gov/articles/PMC9719521/)
- [LIQUORICE 文档](https://liquorice.readthedocs.io/)
- [LBFextract 文档](https://lbf.readthedocs.io/en/latest/)
- [cfDNApipe](https://github.com/XWangLabTHU/cfDNApipe)
- [cfDNA UniFlow](https://github.com/kircherlab/cfDNA-UniFlow)
- [cfDNAFE](https://github.com/Cuiwanxin1998/cfDNAFE)
- [cfDNAanalyzer](https://liymlab.github.io/cfDNAanalyzer/Tutorial/)
- [EMIT](https://github.com/nglaz0v/EMIT)
- [DeepFRAG](https://pmc.ncbi.nlm.nih.gov/articles/PMC12973171/)
- [ichorCNA](https://github.com/broadinstitute/ichorCNA)
- [QDNAseq](https://bioconductor.org/packages/QDNAseq/)
- [WisecondorX](https://github.com/CenterForMedicalGeneticsGhent/WisecondorX)
- [HMMcopy](https://bioconductor.org/packages/release/bioc/html/HMMcopy.html)
- [CNVkit](https://cnvkit.readthedocs.io/)
- [Control-FREEC](https://github.com/BoevaLab/FREEC)
- [CopywriteR](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-015-0617-1)
- [FACETS / facetsSuite](https://github.com/mskcc/facets-suite)
- [PureCN](https://www.bioconductor.org/packages/release/bioc/html/PureCN.html)
- [BayesCNV](https://github.com/Pillar-Biosciences-Inc/BayesCNV)
- [QSEA](https://bioconductor.org/packages/release/bioc/vignettes/qsea/inst/doc/qsea_tutorial.html)
- [Bismark 论文](https://pmc.ncbi.nlm.nih.gov/articles/PMC3102221/)
- [MethylDackel](https://github.com/dpryan79/MethylDackel)
- [nf-core/methylseq](https://github.com/nf-core/methylseq)
- [FinaleMe](https://github.com/epifluidlab/FinaleMe)
- [cfTools](https://www.bioconductor.org/packages/release/bioc/html/cfTools.html)
- [MethylBERT](https://github.com/CompEpigen/methylbert)
- [cfDecon](https://github.com/Susanxuan/cfDecon)
- [CelFiE-ISH](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-024-03275-x)
- [CelFEER](https://github.com/pi-zz-a/CelFEER)
- [UXM](https://github.com/nloyfer/UXM_deconv)
- [MethAtlas](https://github.com/nloyfer/meth_atlas)
- [cfNOMe](https://github.com/FlorianErger/cfNOMe)
- [MetDecode](https://github.com/JorisVermeeschLab/MetDecode)
- [CpGPT](https://github.com/lucascamillomd/CpGPT)
- [MethylGPT](https://github.com/albert-ying/MethylGPT)
- [MethFormer](https://huggingface.co/CChahrour/Methformer)
- [cfMethylPre](https://pmc.ncbi.nlm.nih.gov/articles/PMC12206449/)
- [Oxford Nanopore cfDNA 甲基化方案说明](https://nanoporetech.com/document/requirements/cfDNA-methyl-profile)
- [ctDNA UMI 检测工具基准](https://pmc.ncbi.nlm.nih.gov/articles/PMC11370058/)
- [体细胞变异检测工具综述](https://pmc.ncbi.nlm.nih.gov/articles/PMC5852328/)
- [sRNAbench / sRNAtoolbox 更新](https://pmc.ncbi.nlm.nih.gov/articles/PMC9252802/)
- [EVmiRNA2.0](https://pmc.ncbi.nlm.nih.gov/articles/PMC12807601/)
- [OpenMS](https://www.openms.org/)
