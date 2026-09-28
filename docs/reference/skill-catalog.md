<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Skill Catalog and Selection Guide

Skills provide scientific judgement, not executable engines or a mandatory
pipeline. All 34 maintained packages live in this repository's `skills/` tree.
The LLM chooses relevant guidance from the question, conversation and observed
data. The situations below describe **selection cues**, not hard-coded triggers.
An unrelated question should not start an analysis merely because a skill matches.

## Three Levels of Guidance

The root orchestrator preserves intent and user control. The assay router helps
identify the molecular material and representation. Specialists supply assay
constraints, while shared-method skills can accompany any compatible specialist.

| Skill ID | Why it exists and what it contributes | Typical automatic selection cue | Example user request |
| --- | --- | --- | --- |
| `liquid-biopsy-analysis` | Prevents generic advice and fixed end-to-end scripts; connects evidence, user intent, capabilities and review. | Scientific planning, interpretation or authorized execution. Also loaded as an ancestor. | "Suggest two useful next steps, but do not run anything." |
| `reflective-learning` | Reviews reusable conversational feedback and plans private skill revisions, including its own guidance. | Durable user preferences, recurring corrections or explicit retrospectives. | "In future, show uncertainty before conclusions; suggest skill changes for review." |
| `memory-curation` | Quietly separates user, task and linked-task memory; updates changed preferences and ages obsolete task-derived habits. | An explicit durable preference/background update, conflict, forgetting request or memory recovery. | "I am now leading the study, so use a more technical level from now on." |
| `assay-routing` | An extension is not an assay. Separates molecular material, measurement and file representation. | Mixed folders, ambiguous tables, a newly encountered assay; ancestor of specialists. | "Which of these files are RNA counts and which are methylation measurements?" |

## Shared Methods

| Skill ID | Motivation and role | Selection cue | Example user request |
| --- | --- | --- | --- |
| `local-model-setup` | Guide hardware fit, private inference profiles and official local runtime setup; bootstrap does not require an LLM. | Local model installation, switching or troubleshooting. | "Which local models fit this computer, and how can I verify tool calling?" |
| `task-memory` | Maintains task context and explicit durable preferences without bypassing skill review. | Meaningful decisions, task continuation, or an ongoing preference. | "Remember that I prefer limitations first in future reports." |
| `task-handoff` | Preserves source-specific context, artifacts and unfinished work. | Explicitly selected conversations to link. | "Summarize these tasks separately before combining them." |
| `linked-task-synthesis` | Integrates evidence while checking contradictions and cohort overlap. | A linked conversation or cross-task question. | "Are these two results independent evidence? Do not rerun anything." |
| `data-intake` | Protect originals, inspect archives and establish sample/provenance identity before computation. | Attachment, extraction, mixed sources, incomplete downloads or malformed files. | "Inspect the folder and tell me what is missing; do not extract yet." |
| `local-data-privacy` | Keep local records separate from the remote model while providing useful aggregate evidence for decisions. | All data inspection, interpretation and reporting. | "Use local tools to summarize QC; keep individual records and complete tables local." |
| `cohort-design` | Avoid leakage and invalid group comparisons; preserve patient, time, replicate and batch identity. | Metadata choices, longitudinal samples, integration, model validation. | "These are paired visits. Is a random sample split appropriate?" |
| `feature-encoding` | Choose a compatible representation and encoder; distinguish reference sequence from patient sequence. | Embeddings, encoding, feature stores, cross-assay integration. | "Can I encode these intervals without a reference genome?" |
| `result-region-followup` | Preserve exact figure-region provenance and separate visual explanation from numerical subset follow-up. | A result crop or reference to selected marks. | "Analyze only the measurements selected in this heatmap." |
| `scientific-visualization` | Choose informative axes, units, missingness displays and representative views; verify real figures. | Plot requests, result interpretation, report assembly. | "Show the distributions and a representative locus; state any sampling." |
| `scientific-reporting` | Turn measured outputs into an English scientific narrative, not a log transcript. | Report writing, a conclusion, summary of several completed steps. | "Write a short report with the actual tables, figures and limitations." |
| `literature-review` | Date and critically appraise primary evidence; prevent invented citations and overclaiming abstract access. | New methods, publication comparison or current literature requests. | "Search recent plasma cfRNA papers and distinguish abstracts from full text." |
| `genetics-dna-analysis` | Coordinate variant interpretation, annotation and germline/CHIP limitations across tasks. | Variant features, VAF explanations, DNA-specific follow-ups. | "Could these plasma variants originate from blood cells?" |
| `genomics-epigenomics` | Connect genome-wide and region-level questions while preserving assay-specific semantics. | Joint coverage, chromatin, methylation or genomic feature questions. | "Can we compare enrichment and coverage without treating both as methylation percentages?" |
| `cancer-research` | Frame biomarkers and monitoring as research evidence with appropriate uncertainty. | Cancer labels, response monitoring, subtype or clinical-sounding conclusions. | "What can this exploratory separation tell us, and what can it not establish?" |

## Assay Specialists

| Skill ID | Motivation and role | Selection cue | Example user request |
| --- | --- | --- | --- |
| `raw-sequencing` | Assay-aware read QC, reference/alignment and UMI prerequisites; no arbitrary FASTQ-to-result shortcut. | cfDNA FASTQ, BAM or CRAM preparation. | "What must be checked before these paired-end reads can support fragment analysis?" |
| `genomic-tracks` | Distinguish BED/bigBed intervals from quantitative bigWig/bedGraph signals and nucleotide sequence. | Genome browser tracks, representative loci or interval distributions. | "Plot these bigBed tracks, but do not claim the interval widths are fragment lengths." |
| `fragmentomics` | Interpret true fragment lengths, ends and nucleosome-related signals with library provenance. | Fragment histograms, paired-end alignment, end motifs or nucleosome profiles. | "Compare fragment length distributions and flag library-related confounding." |
| `ctdna-variants` | Review VAF, depth, error suppression and CHIP/germline evidence. | Plasma SNV/indel tables, VCF/MAF, serial VAF. | "Summarize the variants and explain what a missing matched normal prevents us from concluding." |
| `copy-number` | Separate depth variation from copy number and tumour fraction; require normalization evidence. | Low-pass WGS, bins, segments or CNV matrices. | "Could this apparent copy-number difference instead be GC or coverage bias?" |
| `methylation-bisulfite` | Keep methylated/total counts, coverage and conversion QC distinct from enrichment signals. | Bisulfite/enzymatic base-level calls. | "Which CpGs have sufficient coverage for a comparison?" |
| `methylation-enrichment` | Interpret capture/enrichment counts with controls rather than as methylation percentages. | cfMeDIP-seq, MeDIP or MBD regions. | "Review enrichment QC and propose a count-based comparison." |
| `methylation-arrays` | Review probe annotation, beta values, detection QC and batch; do not substitute proxy ratios for normalization. | IDAT files, beta/M-value or paired intensity matrices. | "Inspect missing probes and beta distributions before differential analysis." |
| `cell-free-rna` | Apply RNA count models, library strategy and contamination constraints to plasma RNA. | Gene/transcript counts, TPM or RNA reads. | "Run count QC first. After review, compare the declared independent groups." |
| `small-rna` | Respect adapter/length, isomiR, haemolysis and normalization specifics. | miRNA/small-RNA libraries or processed counts. | "Can these normalized miRNA abundances be used as raw counts?" |
| `plasma-proteomics` | Keep identification, platform, abundance scale and missingness explicit. | Protein abundance or affinity-platform tables. | "Plot protein distributions without replacing non-detections with zero." |
| `plasma-metabolomics` | Separate feature signals from confident metabolite identity; consider blanks and drift. | LC/GC-MS or NMR feature tables. | "Which QC metadata do we need before interpreting these metabolite features?" |
| `extracellular-vesicles` | Apply isolation/characterization and cargo principles; molecular data alone do not establish EV origin. | Blood EV counts, cargo RNA/protein tables. | "Can this cargo profile establish tumour-derived vesicles?" |
| `circulating-tumour-cells` | Maintain enumeration definition, volume denominators and enrichment bias in numeric/molecular measurements. | CTC counts or molecular profiles. | "Convert these supplied counts and volumes to cells/mL with uncertainty." |
| `digital-pcr` | Distinguish occupancy, concentration, uncertainty, saturation and detection limits. | Accepted/positive partition counts, ddPCR concentrations or mutant/WT assays. | "Quantify these partitions and retain uncertainty for the zero-positive wells." |

## Manual Loading, Precisely

Every ID above can be inspected explicitly:

```bash
liquid-agent skills load default:digital-pcr
liquid-agent skills load default:digital-pcr references/evidence.md
liquid-agent skills tree methylation --json
```

In the interactive shell use `/skills load default:digital-pcr`. These commands
**display** the instructions; they do not run an assay and do not permanently
pin the package into every future LLM turn. In Web, expand **Skills**, select a
package and read its instructions or source notes. Viewing is also not execution.

To ask the agent to apply guidance to the current conversation, say:

> Load `default:digital-pcr` and use it to assess this assay. Explain the required
> controls before proposing any analysis. Do not run anything yet.

The controller can then call `load_skill`; parent guidance is included
automatically. A full-load receipt records the instruction hashes. A reference
request loads one listed source note, not arbitrary external files. Repeating a
view or load does not create a result report or delete a previous plan.

## Knowledge Versus Engines

For supported explicit tables, the [assay-table engine](../guides/assay-tables.md)
adds dPCR/CTC quantification, processed-matrix QC and an optional PyDESeq2 count
contrast. The specialist still checks whether those operations answer the user's
question. A beta-table QC engine is not an IDAT preprocessing engine; a protein
abundance plot is not raw mass-spectrometry identification.

For broader capabilities see the [capability matrix](capability-matrix.md).
For inheritance, storage, learned notes and safety see the
[professional skill guide](../guides/professional-skills.md).

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# Skill 目录与选择指南（中文）

Skills 提供科学判断，不是可执行引擎，也不是强制流水线。全部 34 个维护中的包都位于本仓库的 `skills/` 目录树中。LLM 根据问题、对话和观察到的数据选择相关指导。以下情况描述的是**选择线索**，不是硬编码触发器。不相关的问题不应仅因匹配某个 skill 就启动分析。

## 三层指导

根编排器保留用户意图与控制权。检测路由器帮助识别分子材料和表示形式。专家 skills 提供检测约束；共享方法 skills 可与任意兼容专家搭配使用。

| Skill ID | 存在动机与贡献 | 典型自动选择线索 | 用户请求示例 |
| --- | --- | --- | --- |
| `liquid-biopsy-analysis` | 避免泛泛建议和固定端到端脚本；连接证据、用户意图、能力和审阅。 | 科学规划、解释或已授权执行；也作为祖先加载。 | “建议两个有用的下一步，但不要执行。” |
| `reflective-learning` | 总结可复用反馈，规划个人 skill 修改，也可改进自身。 | 长期偏好、重复纠正或明确要求复盘。 | “以后先说明不确定性，再下结论；草拟修改让我审阅。” |
| `memory-curation` | 安静地区分用户、任务与综合任务记忆，更新已变化偏好，并让过时的任务来源习惯自然淡出。 | 明确的长期偏好/背景变化、记忆冲突、遗忘请求或上下文恢复。 | “我现在负责整个研究，今后可以用更专业的层次回答。” |
| `assay-routing` | 扩展名不等于检测类型；区分分子材料、测量和文件表示。 | 混合文件夹、歧义表格、新检测类型；专家的祖先。 | “哪些文件是 RNA 计数，哪些是甲基化测量？” |

## 共享方法

| Skill ID | 动机与作用 | 选择线索 | 用户请求示例 |
| --- | --- | --- | --- |
| `local-model-setup` | 指导硬件适配、本地推理配置与官方运行时安装；首次安装不依赖 LLM。 | 本地模型安装、切换或故障排查。 | “这台电脑能运行哪些本地模型，如何核实工具调用？” |
| `task-memory` | 维护任务上下文与明确的长期偏好，保留技能审阅流程。 | 重要决定、续接任务或长期偏好。 | “以后报告都请先说明局限。” |
| `task-handoff` | 保留各来源的上下文、结果和未完成工作。 | 用户明确选择链接的对话。 | “先分别总结这些任务，再综合理解。” |
| `linked-task-synthesis` | 整合证据，检查矛盾及队列重叠。 | 综合对话与跨任务追问。 | “这两份结果是独立证据吗？不要重算。” |
| `data-intake` | 保护原始文件，检查归档，在计算前建立样本/来源身份。 | 添加数据、解压、混合来源、下载不完整或格式异常。 | “检查文件夹并告诉我缺少什么；先不要解压。” |
| `local-data-privacy` | 将本地记录与远程模型分离，同时提供有用的汇总证据供决策。 | 所有数据查看、解释和报告。 | “用本地工具汇总 QC；个体记录与完整表格留在本地。” |
| `cohort-design` | 避免泄漏和无效组间比较；保留患者、时间、重复和批次身份。 | 元数据选择、纵向样本、整合、模型验证。 | “这些是配对访视，随机样本划分合适吗？” |
| `feature-encoding` | 选择兼容的表示与编码器；区分参考序列与患者序列。 | 嵌入、编码、特征存储、跨检测整合。 | “没有参考基因组，能编码这些区间吗？” |
| `result-region-followup` | 保留图中选区的精确来源，区分图片解释和数据子集分析。 | 结果截图或对选中数据标记的追问。 | “仅分析这张热图中选中的测量值。” |
| `scientific-visualization` | 选择有信息量的坐标轴、单位、缺失展示和代表性视图；验证真实图形。 | 绘图请求、结果解释、报告组装。 | “展示分布和代表性位点，并说明是否抽样。” |
| `scientific-reporting` | 将实测输出转为英文科学叙述，而不是日志抄录。 | 报告写作、结论、多个已完成步骤的总结。 | “写一份包含实际表格、图形和限制的简短报告。” |
| `literature-review` | 标注日期并批判性评估一手证据；防止编造引用或夸大摘要访问范围。 | 新方法、出版物比较或最新文献请求。 | “检索近期血浆 cfRNA 论文，区分摘要与全文。” |
| `genetics-dna-analysis` | 在任务间协调变异解释、注释和胚系/CHIP 限制。 | 变异特征、VAF 解释、DNA 专用后续分析。 | “这些血浆变异可能来自血细胞吗？” |
| `genomics-epigenomics` | 连接全基因组和区域级问题，同时保留检测特异语义。 | 联合覆盖度、染色质、甲基化或基因组特征问题。 | “能否比较富集量与覆盖度，而不把两者都当成甲基化百分比？” |
| `cancer-research` | 将生物标志物和监测界定为具有适当不确定性的研究证据。 | 癌症标签、疗效监测、亚型或类似临床结论。 | “这种探索性分离能说明什么，又不能确立什么？” |

## 检测专家

| Skill ID | 动机与作用 | 选择线索 | 用户请求示例 |
| --- | --- | --- | --- |
| `raw-sequencing` | 检测感知的 reads QC、参考/比对与 UMI 前提；不允许任意从 FASTQ 直接跳到结果。 | cfDNA FASTQ、BAM 或 CRAM 准备。 | “这些双端 reads 用于片段分析前必须检查什么？” |
| `genomic-tracks` | 区分 BED/bigBed 区间、定量 bigWig/bedGraph 信号和核苷酸序列。 | 基因组浏览器轨道、代表性位点或区间分布。 | “绘制这些 bigBed 轨道，但不要声称区间宽度就是片段长度。” |
| `fragmentomics` | 结合文库来源解释真实片段长度、末端和核小体相关信号。 | 片段直方图、双端比对、末端基序或核小体概览。 | “比较片段长度分布，并标注文库相关混杂。” |
| `ctdna-variants` | 审阅 VAF、深度、错误抑制和 CHIP/胚系证据。 | 血浆 SNV/indel 表格、VCF/MAF、连续 VAF。 | “汇总变异，并解释没有配对正常样本时不能得出哪些结论。” |
| `copy-number` | 区分深度变化、拷贝数和肿瘤比例；要求标准化证据。 | 低深度 WGS、分箱、分段或 CNV 矩阵。 | “这个表面上的拷贝数差异，会不会其实是 GC 或覆盖偏倚？” |
| `methylation-bisulfite` | 将甲基化/总计数、覆盖度与转换 QC 同富集信号区分。 | 亚硫酸氢盐/酶法碱基级结果。 | “哪些 CpG 覆盖度足够用于比较？” |
| `methylation-enrichment` | 利用对照解释捕获/富集计数，而非将其当成甲基化百分比。 | cfMeDIP-seq、MeDIP 或 MBD 区域。 | “审阅富集 QC，并提出基于计数的比较。” |
| `methylation-arrays` | 审阅探针注释、beta 值、检测 QC 和批次；不以替代比值冒充标准化。 | IDAT 文件、beta/M 值或配对强度矩阵。 | “差异分析前先检查缺失探针和 beta 分布。” |
| `cell-free-rna` | 将 RNA 计数模型、文库策略和污染约束应用于血浆 RNA。 | 基因/转录本计数、TPM 或 RNA reads。 | “先运行计数 QC；审阅后再比较已声明的独立组。” |
| `small-rna` | 尊重接头/长度、isomiR、溶血和标准化的特性。 | miRNA/小 RNA 文库或已处理计数。 | “这些标准化 miRNA 丰度能当成原始计数吗？” |
| `plasma-proteomics` | 明确鉴定、平台、丰度尺度和缺失情况。 | 蛋白丰度或亲和平台表格。 | “绘制蛋白分布，不要把未检出值替换为零。” |
| `plasma-metabolomics` | 区分特征信号与高置信度代谢物身份；考虑空白和漂移。 | LC/GC-MS 或 NMR 特征表格。 | “解释这些代谢物特征前，需要哪些 QC 元数据？” |
| `extracellular-vesicles` | 应用分离/表征与载荷原则；仅凭分子数据不能确立 EV 来源。 | 血液 EV 计数、载荷 RNA/蛋白表格。 | “这个载荷谱能确立肿瘤来源囊泡吗？” |
| `circulating-tumour-cells` | 在数值/分子测量中保留计数定义、体积分母和富集偏倚。 | CTC 计数或分子谱。 | “将提供的计数与体积转换为 cells/mL，并保留不确定性。” |
| `digital-pcr` | 区分占有率、浓度、不确定性、饱和与检出限。 | 有效/阳性分区计数、ddPCR 浓度或突变/WT 检测。 | “对这些分区定量，并为零阳性孔保留不确定性。” |

## 手动加载的准确含义

上述每个 ID 都可以显式查看：

```bash
liquid-agent skills load default:digital-pcr
liquid-agent skills load default:digital-pcr references/evidence.md
liquid-agent skills tree methylation --json
```

在交互式 Shell 中使用 `/skills load default:digital-pcr`。这些命令**显示**指令，不会运行检测，也不会将包永久固定到每个未来 LLM 轮次。Web 中展开 **Skills**，选择包并阅读指令或来源笔记。查看同样不等于执行。

如需让智能体将指导应用于当前对话，可以说：

> 加载 `default:digital-pcr` 并用它评估此检测。在提出分析前解释所需对照。暂时不要执行任何操作。

控制器随后可调用 `load_skill`；父级指导会自动包含在内。完整加载凭据记录指令哈希。参考请求加载一个已列出的来源笔记，而不是任意外部文件。重复查看或加载不会创建结果报告，也不会删除之前的计划。

## 知识与引擎的区别

对于受支持的显式表格，[检测表格引擎](../guides/assay-tables.md) 提供 dPCR/CTC 定量、已处理矩阵 QC，以及可选 PyDESeq2 计数对比。专家 skill 仍需检查这些操作是否回答用户问题。Beta 表格 QC 引擎不是 IDAT 预处理引擎；蛋白丰度图不是原始质谱鉴定。

更广泛的能力见[能力矩阵](capability-matrix.md)。继承、存储、学习笔记和安全见[专业 skill 指南](../guides/professional-skills.md)。
