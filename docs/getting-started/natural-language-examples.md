<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Questions for Real Research Situations

Use a question that states your scientific purpose, what may run, and where to stop. The first seven scenarios below follow the [real GSE174302 browser walkthrough](workspace-walkthrough.md); its screenshots show the actual questions, API answers and local outputs. The additional assay examples are **adaptable prompts**, not claims that those studies were executed in this documentation review.

## 1. New to the dataset: inspect, then plan

**Situation:** You have two circulating-RNA count matrices and want to know what can be learned before spending time on analysis.

> I am studying circulating RNA in colorectal cancer. Inspect the attached GSE174302 cohort and its two count matrices. Explain the sample groups and measurement differences, then propose a staged plan: QC each matrix, compare CRC with healthy samples, compare the two sets of results, and write an exploratory report. Use appropriate skills. Do not run the analyses yet.

**Inspect:** Sources should show the intended cohort; Plan should name actionable steps and prerequisites. This request did not execute an analysis in the live run. Read the plan before clicking **Run next step**. [Screenshots](workspace-walkthrough.md#2-discuss-the-study-before-running-it).

## 2. Continue a multi-step study without repeating work

**Situation:** The first QC is complete. You are ready to authorize the remaining calculations.

> Proceed with QC of the second matrix and the CRC-versus-healthy differential analysis of each matrix. Then inspect the available comparison tasks and run matched-expression and differential-effect concordance. Keep the two measurement definitions separate, preserve model warnings, and publish an exploratory report. Reuse completed QC; do not rerun it.

**Inspect:** New work should correspond to remaining steps. In the live run, there were six scientific runs in total, not a new QC every time a question was asked. The same 73 samples in two measurement definitions do not constitute independent validation.

## 3. A figure looks unusual: select its actual data

**Situation:** Several PCA points lie far from the main cluster. In Results, drag a region around them and enter:

> Inspect these PCA outliers in the source data. Are they technical or biological? Do not exclude samples.

**Inspect:** Does the popover say exact mapped marks or image only? The live selection mapped six samples. The answer inspected source values but could not determine the cause or justify exclusion. [Selection and answer screenshots](../guides/images-and-result-actions.md#live-example-two-figure-follow-up).

## 4. Compare evidence across two figures

**Situation:** You want to relate a PCA view to a heatmap block. Stage one crop from each by leaving the region field empty and clicking **+**, then ask:

> Compare the PCA outlier region with this heatmap block. Inspect both mappings; explain their units and whether they identify the same samples. Summarize the selected data separately and write a short follow-up report. Do not merge selections or rerun differential analysis.

**Inspect:** Both images should appear in your message. In the real example, the second region mapped 165 cells; a local selected-data table and report were produced. The agent did not claim the two crops identified the same individuals. [Two-image message and table](workspace-walkthrough.md#6-combine-crops-from-two-different-figures).

## 5. Understand an unfamiliar figure from elsewhere

**Situation:** You have PNGs, but no underlying dataset. Upload them with **+**, then ask:

> These two figures come from circulating-RNA QC. I am new to this: what is the difference between the PCA scatter plot and the feature heatmap? Does either prove that cancer can be diagnosed? Explain the colour scale and what information is still missing.

**Inspect:** A useful answer explains axes, units and limits without inventing source-data access. This was a real two-image API question in a separate chat. Uploading a PNG does not recreate a mapped Results selection. [Upload and answer](workspace-walkthrough.md#9-ask-with-uploaded-images-even-without-attaching-a-dataset).

## 6. Teach a reporting preference without silent changes

**Situation:** You want a consistent report style for future work.

> For future circulating-RNA reports, start with three plain-language findings and put comparison figures before dense tables. Explain that PCA is exploratory and that heatmap colours are relative z-scores in figure captions. Please remember these preferences, but show me proposed skill edits before applying anything.

**Inspect:** Read the reason and red/green diff. Accept only the changes you want. A one-off instruction need not create a permanent preference. In the real example, two drafts appeared; one was accepted and the other rejected. [Actual review](../guides/professional-skills.md#live-review-example).

## 7. Review and correct a report using retained evidence

**Situation:** The report exists, but the order or measurement labels need attention.

> Regenerate the full report using the accepted reporting guidance and the completed analyses. Include both comparison figures and retain fit warnings and study limitations. Do not repeat matrix calculations.

Then, when labels are ambiguous:

> Verify which differential output belongs to each input definition. Check feature counts and finite estimates against the corresponding source provenance. Correct swapped table captions without recomputing.

**Inspect:** Read the tables as well as the answer. During this documentation run, report review caught swapped measurement captions; an explicit provenance-based correction was needed. A successful model turn is not a substitute for scientific review. [Report review](workspace-walkthrough.md#8-revise-the-report-without-recomputing-the-matrices).

## Additional tasks to adapt to your own data

These prompts describe intentions. Availability depends on actual inputs, installed tools, model weights and study design. Ask for inspection first; do not assume a suggested operation has already run.

| Situation | Example request | Check before proceeding |
| --- | --- | --- |
| Two separate datasets | “Attach these two sources. Keep their analyses separate and propose a defensible comparison; do not pool them automatically.” | Join keys, assay units, cohorts and batch confounding. |
| Missing labels | “Assess QC without group testing. Tell me which metadata would make a comparison valid.” | Do not infer outcomes from short sample codes. |
| Paired/longitudinal data | “Check patient and draw identifiers. Explain whether the available tool supports the repeated-measure design before proposing a contrast.” | Independent-sample testing may be inappropriate. |
| cfDNA raw tracks | “Inspect the coverage tracks, run the available numerical summary and visualization, and explain what cannot be inferred without aligned-read information.” | Raw coverage summaries are not a validated CNV caller. |
| Encoding | “Inspect format and local encoder availability; estimate the required preparation before running feature extraction. Do not download weights or launch encoding yet.” | Compatible inputs, installed weights, resources and time. |
| Existing embeddings | “Use the existing feature store to review outliers and a 2D projection. Do not encode the same files again.” | Features must exist and correspond to the intended samples. |
| Variant table | “Check the schema and filter support. Summarize VAF and recurrence, retaining germline/CHIP and depth limitations.” | Depth, annotation and matched-normal assumptions. |
| Methylation/CNV matrix | “Inspect the declared units, then propose QC and exploratory sample/region figures. Do not treat a signal matrix as a diagnosis.” | Normalization and biological interpretation depend on assay. |
| Digital PCR | “Quantify accepted partition counts with uncertainty, flag zero-positive and saturated wells, and publish the numerical table.” | This does not validate gating or assay detection limits. |
| Protein or EV table | “Summarize completeness and distributions before a group comparison; explain missingness and unit limitations.” | Missingness can confound comparisons. |
| Methods and literature | “Find evidence for a suitable liquid-biopsy method, distinguish papers from local findings, and cite only sources actually retrieved.” | Literature retrieval uses the network and does not validate this cohort. |
| Interrupted task | “Summarize what completed, what failed and what remains. Continue only unfinished authorized work from retained results.” | A cancelled job is not a completed result. |

For schemas and implemented operations, use [assay tables](../guides/assay-tables.md), [cfDNA analysis](../guides/cfdna-analysis.md), [encoding](../guides/blood-encoding.md) and the [capability matrix](../reference/capability-matrix.md). The [illustrated walkthrough](workspace-walkthrough.md) provides a complete example.

## Interface shortcuts

- **Ask** explains the selected result; **Use for next step** requests follow-up advice; **Run next step** executes a plan step.
- **Guide** steers a running turn; **Stop** requests cancellation. Read the resulting status before continuing.
- Default Web: `liquid-agent`; explicit terminal: `liquid-agent cli`; public homepage: `liquid-agent wiki`.
- In CLI, `/image "/path/to/figure.png" What does this show?` is an explicit image request. See [CLI commands](../reference/cli.md) for key and skill-review management.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 面向真实研究场景的提问示例

问题最好说明科学目的、允许执行什么、在哪里停止。前七个场景来自[真实 GSE174302 浏览器教程](workspace-walkthrough.md)，可查看实际问题、API 回答和本地结果截图。后面的检测示例是**需要按数据调整的提示模板**，不代表本次文档更新执行了那些研究。

## 1. 初次接触数据：先检查，再规划

**场景：** 有两张循环 RNA 计数矩阵，想先知道可以研究什么。

> 我研究结直肠癌的循环 RNA。检查 GSE174302 队列与两张计数矩阵，解释分组和测量差异，提出分别质控、分别差异分析、比较结果、生成探索性报告的计划。使用合适技能，暂时不要执行。

**检查：** Sources 是否为目标队列，Plan 是否列出可运行步骤及前置条件。本次真实请求没有启动分析，先审阅再点 **Run next step**。[完整截图](workspace-walkthrough.md)。

## 2. 连续多步骤任务，但不重复已完成工作

**场景：** 第一项质控完成，准备授权剩余计算。

> 继续第二张矩阵的 QC，以及两种矩阵分别的 CRC 对健康差异分析。之后检查并执行表达一致性和差异效应一致性比较。保留不同计数定义及模型警告，生成探索性报告；复用已完成 QC，不要重复。

**检查：** 新计算应对应剩余步骤。本例累计六项科学运行，不是每问一句都重跑 QC。两种测量来自相同 73 个样本，不是独立验证。

## 3. 图上有异常：选择对应数据来问

**场景：** PCA 中几个点偏离主体。在 Results 拖动框选后提问：

> 检查这些 PCA 离群样本的源数据，是技术差异还是生物学差异？不要排除样本。

**检查：** 浮层是精确映射还是仅图片？本例选中六个样本，回答检查源值，但不能确认原因或据此排除样本。[选区和回答截图](../guides/images-and-result-actions.md#live-example-two-figure-follow-up)。

## 4. 比较来自两张图的证据

**场景：** 想联系 PCA 与一块热图。分别框选，留空点 **+** 暂存，再统一提问：

> 比较 PCA 离群区域和热图区域，检查映射、单位、是否为同一批样本。分别汇总选中数据并生成简短报告，不要合并选区或重跑差异分析。

**检查：** 两张图片都应出现在用户消息中。本例热图映射到 165 个单元格，生成了本地选区表和报告，没有凭截图声称两者是同一批个体。[完整实操](workspace-walkthrough.md)。

## 5. 解释从别处得到的陌生图表

**场景：** 只有 PNG，没有源数据。用 **+** 上传，再问：

> 这两张图来自循环 RNA QC。我是初学者，PCA 和特征热图有什么区别？它们能证明可以诊断癌症吗？解释配色和仍缺少的信息。

**检查：** 应解释坐标、单位、证据缺口，不应编造对源数据的访问。本次在独立对话中实际进行了双图 API 提问；上传 PNG 不会重建 Results 的数据映射。[上传与回答](workspace-walkthrough.md)。

## 6. 学习偏好，但不要静默修改

**场景：** 希望以后报告采用一致格式。

> 以后循环 RNA 报告先列三个通俗发现，再放比较图、密集表格；图注说明 PCA 为探索性、热图颜色为相对 z-score。请记住，但先展示技能修改草案，不要直接应用。

**检查：** 阅读原因和红绿差异，只接受需要的内容。一次性指令不必成为永久偏好；本例产生两份草案，接受一份、拒绝一份。[实际审阅截图](../guides/professional-skills.md#live-review-example)。

## 7. 用保留结果核对、修订报告

**场景：** 报告已有，但呈现或测量名称需修改。

> 用接受的指导和已完成分析重新生成完整报告，包含两张比较图及模型警告、研究限制。不要重复矩阵计算。

如果标签不清楚，继续问：

> 核对每种输入定义对应的差异结果，按来源记录检查特征数和有限估计数；纠正互换的表标题，不要重算。

**检查：** 不只读回复，还要看实际表格。本次文档实操确实发现过测量标题互换，需要依据来源明确纠正。模型回合成功结束不能代替科学审阅。[报告步骤](workspace-walkthrough.md)。

## 可根据自己数据调整的其他任务

以下是意图模板，能否执行取决于输入、已安装工具、模型权重及研究设计。先检查，不要把建议当成已执行结果。

| 场景 | 可用提问 | 执行前检查 |
| --- | --- | --- |
| 两个独立数据集 | “附加两个源，分别分析并提出合理比较，不要自动合并。” | 连接键、单位、队列和批次混杂。 |
| 标签缺失 | “只评估 QC，不做组间检验，说明还需哪些元数据。” | 不从简短样本编号猜结局。 |
| 配对／纵向数据 | “先核对患者和采样标识，说明现有工具是否支持重复测量设计。” | 独立样本检验可能不适合。 |
| cfDNA 覆盖轨道 | “检查轨道，执行可用数值汇总和可视化，说明缺少比对信息时的推断边界。” | 覆盖汇总不等于验证过的 CNV 调用。 |
| 特征编码 | “检查格式和本地编码器，评估准备工作；先不下载权重或启动编码。” | 输入、权重、资源与耗时。 |
| 已有特征 | “复用特征库检查离群点和二维投影，不要重新编码相同文件。” | 特征对应正确样本。 |
| 变异表 | “检查格式和过滤能力，汇总 VAF、复现频率，保留深度、胚系和 CHIP 限制。” | 深度、注释及匹配正常样本假设。 |
| 甲基化／CNV 矩阵 | “确认单位，规划 QC 和样本／区域图，不把信号矩阵当成诊断。” | 检测方法决定归一化和解释。 |
| 数字 PCR | “定量已接受的分区计数，给出不确定性，标记零阳性和饱和孔。” | 不代表已验证门控或检出限。 |
| 蛋白／EV 表 | “比较前先总结完整性、分布、缺失和单位限制。” | 缺失模式可能造成混杂。 |
| 方法／文献 | “检索适合的方法证据，区分论文结论和本地发现，仅引用实际读取来源。” | 联网检索不等于验证该队列。 |
| 中断恢复 | “总结已完成、失败和剩余内容，只基于保留结果继续尚未完成的授权工作。” | 取消不代表完成。 |

具体格式和能力见[检测表格](../guides/assay-tables.md)、[cfDNA 分析](../guides/cfdna-analysis.md)、[编码](../guides/blood-encoding.md)、[能力矩阵](../reference/capability-matrix.md)。[工作区图文教程](workspace-walkthrough.md)提供完整示例。

## 交互入口速查

- **Ask** 解释所选结果；**Use for next step** 请求建议；**Run next step** 执行计划步骤。
- **Guide** 指导当前运行，**Stop** 请求取消，之后应阅读结束状态。
- `liquid-agent` 默认 Web；`liquid-agent cli` 终端；`liquid-agent wiki` 公开主页。
- CLI 用 `/image "/path/to/figure.png" 这是什么图？` 明确提交图片；密钥和技能审阅命令见 [CLI 参考](../reference/cli.md)。
