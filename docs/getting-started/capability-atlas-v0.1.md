<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Capability Atlas — V0.1

A visual tour of Liquid Agent's first early-access release: inspect liquid-biopsy data, discuss a plan, authorize analysis and return to its evidence. This gallery covers **V0.1**, including the subsequent model-menu and conversation-continuity maintenance updates. **The 3 October 2026 major scientific upgrade is not included in this early-access release.**

[Read the V0.1 release summary](../releases/v0.1.md) · [Browse version history](../releases/index.md) · [Open the workbench guide](web-ui.md)

**Gallery prepared: 5 October 2026, Europe/London.** The research screenshots reuse real English-language browser sessions from **14–15 September 2026**, using the prepared public GSE174302 cfRNA cohort. The model controls were captured during isolated **4 October 2026** release-interface checks with synthetic test state. They contain no API keys or private patient data. Earlier model names and skill counts remain visible in historical captures; they are not the current model catalog or capability totals. Click any screenshot to see the full image.

## 01. Inspect your source

[![The workbench after scanning the prepared cfRNA source.](../assets/current-workspace/02-source-metadata.png)](../assets/current-workspace/02-source-metadata.png)

The three-panel workspace keeps Sources and Skills beside the conversation, Results and Plan. This source scan found six prepared files and metadata for 73 samples; **no analysis had run**. Recognized labels are a starting point for review, not proof of a valid study design.

[Choose and inspect a source](workspace-walkthrough.md)

## 02. Review before running

[![A reviewed RNA plan with explicit Run next step control.](../assets/current-workspace/04-reviewed-plan.png)](../assets/current-workspace/04-reviewed-plan.png)

An English request produced separate QC and differential-expression steps for two cfRNA count matrices. **Run next step** makes execution explicit; displaying a plan does not run it. Measurement definitions and prerequisite checks remain visible.

[Follow the staged plan](workspace-walkthrough.md)

## 03. Keep results beside the discussion

[![The completed first-matrix QC report and its registered tables.](../assets/current-workspace/07-qc-result.png)](../assets/current-workspace/07-qc-result.png)

The authorized first QC task completed on 73 samples and 19,813 features, registering its report, tables and exploratory figures. **Ask** and **Use for next step** support discussion of the existing result; they do not themselves authorize another calculation.

[Read the completed QC example](workspace-walkthrough.md)

## 04. Ask about a figure region

[![A PCA rectangle selects six mapped sample marks for a focused question.](../assets/current-workspace/19-pca-region-question.png)](../assets/current-workspace/19-pca-region-question.png)

The compact region control stages a question about six mapped PCA marks. Supported mappings connect a selection to registered source evidence; an image-only region cannot supply missing identities. This capture shows a **draft question**, not its answer or an instruction to exclude samples.

[Use figures as evidence](../guides/images-and-result-actions.md)

## 05. Discuss uploaded images

[![Two uploaded cfRNA figures and a completed explanatory answer.](../assets/current-workspace/35-uploaded-images-and-answer.png)](../assets/current-workspace/35-uploaded-images-and-answer.png)

A separate conversation with no attached dataset can discuss uploaded PCA and heatmap images. The completed answer explains their different units and interpretive limits. Uploading a PNG does not recreate source mappings or establish that cancer can be diagnosed.

[Try an image question](workspace-walkthrough.md)

## 06. Review reusable guidance

[![A proposed reporting-guidance edit with compact accept and reject controls.](../assets/current-workspace/27-review-reporting-diff.png)](../assets/current-workspace/27-review-reporting-diff.png)

The reporting preference produced a readable change proposal. You can inspect additions and deletions before accepting or rejecting it; guidance is not applied simply because the agent drafted it. Scientific constraints remain part of the retained guidance.

[Understand professional skills](../guides/professional-skills.md)

## 07. Bring conversations together

[![A linked conversation compares the original registered QC summaries.](../assets/task-linking/combined-question.png)](../assets/task-linking/combined-question.png)

Linked tasks bring separate conversations' context and registered result references into a new discussion. This answer compared two existing QC summaries without rerunning them, and explained that the two count matrices came from **the same cohort**, not independent validation cohorts.

[Link tasks and retain local memory](../guides/linked-tasks-and-memory.md)

## 08. Choose a model without starting over

[![The maintained release model menu keeps local-model and key management visible.](../assets/capability-atlas-v0.1/model-menu.png)](../assets/capability-atlas-v0.1/model-menu.png)

The maintained model menu keeps **Manage local models** and **Manage keys** visible beneath the scrollable choices. GPT-6 Luna remains the default; GPT, Gemini and configured local profiles continue the same conversation with its retained safe context and task memory. Switching is not permission to send additional private data or rerun completed analysis.

**Interface-check fixture:** this screenshot uses synthetic catalog and credential-readiness state in an empty isolated release workspace. It demonstrates the menu layout, not valid credentials, real API calls or unlimited model context.

[Configure online models and continuity](../guides/openai-configuration.md)

## 09. Keep local models within reach

[![The release local-model library with reviewed names and installation controls.](../assets/capability-atlas-v0.1/local-model-library.png)](../assets/capability-atlas-v0.1/local-model-library.png)

**Manage local models** opens the reviewed, hardware-screened library. Eligible models can be installed, paused, continued or abandoned; installed profiles can be explicitly selected. Model storage is separate from research datasets, and changing a profile preserves saved cloud configuration.

**Isolated release-interface check:** the catalog and runtime are test fixtures; this image shows the library before installation. It does not claim that these weights were downloaded or that every listed model has passed scientific or hardware benchmarks.

[Install and manage local models](../guides/local-models.md)

## 10. Return to work already done

[![The image conversation in Trash with Restore, alongside retained research results.](../assets/current-workspace/33-trash-restore.png)](../assets/current-workspace/33-trash-restore.png)

Results history retains earlier reports, while **Trash → Restore** returns an archived conversation. This capture shows the isolated image conversation in Trash; the original study inputs were not deleted. Permanent deletion is a separate action.

[Recover and restore a conversation](workspace-walkthrough.md)

## Explore the release in detail

These scenes illustrate the interaction loop; they are not an exhaustive assay benchmark or a clinical-validation claim. Use the [V0.1 summary](../releases/v0.1.md) for the release boundary, [natural-language examples](natural-language-examples.md) for English requests and the [real cfRNA walkthrough](workspace-walkthrough.md) for the full scientific example. The Docs language control presents this gallery in English or Simplified Chinese; changing that setting does not determine the agent's response language.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 能力图谱 — V0.1

以截图浏览 Liquid Agent 的第一个早鸟测试版本：检查液体活检数据、讨论计划、授权分析，再回到原始结果审阅证据。本画廊对应 **V0.1**，包含随后同步的模型菜单及多模型对话记忆维护更新。**2026 年 10 月 3 日的科研功能大更新未包含在这个早鸟测试版本中。**

[阅读 V0.1 版本总结](../releases/v0.1.md) · [浏览历史版本](../releases/index.md) · [打开工作台指南](web-ui.md)

**画廊整理时间：2026 年 10 月 5 日，Europe/London。** 科研截图复用 **2026 年 9 月 14–15 日**的真实英文浏览器会话，使用事先整理的公开 GSE174302 cfRNA 队列。模型控件截图来自 **2026 年 10 月 4 日**隔离发布界面检查，使用合成测试状态，不包含 API 密钥或私有患者数据。历史截图保留当时的型号和技能数量，不代表当前模型目录或能力总数。点击截图可查看完整原图。

## 01. 检查数据源

[![扫描事先整理的 cfRNA 数据源后的工作台。](../assets/current-workspace/02-source-metadata.png)](../assets/current-workspace/02-source-metadata.png)

三栏工作台将 Sources、Skills、对话、Results 和 Plan 放在同一工作区。本次扫描识别六个准备好的文件和 73 个样本的元数据；此时**还没有执行分析**。识别标签是进一步检查的起点，并不证明研究设计已经成立。

[选择并检查数据源](workspace-walkthrough.md)

## 02. 先审阅，再执行

[![审阅 RNA 分析计划，并通过 Run next step 明确启动下一步。](../assets/current-workspace/04-reviewed-plan.png)](../assets/current-workspace/04-reviewed-plan.png)

英文请求为两张 cfRNA 计数矩阵生成各自的质控和差异表达步骤。**Run next step** 让执行范围清晰可见；展示计划不会启动计算。测量定义和前置条件仍需逐项检查。

[按阶段审阅计划](workspace-walkthrough.md)

## 03. 将结果留在讨论旁边

[![完成第一张矩阵质控后，报告和注册结果表显示在右侧。](../assets/current-workspace/07-qc-result.png)](../assets/current-workspace/07-qc-result.png)

经授权的第一项质控实际完成，处理 73 个样本和 19,813 个特征，并注册报告、表格与探索性图形。**Ask** 和 **Use for next step** 用于讨论已有结果，本身不授权另一次计算。

[阅读已完成的质控示例](workspace-walkthrough.md)

## 04. 针对图中选区提问

[![在 PCA 上框选六个有映射的样本点，准备聚焦提问。](../assets/current-workspace/19-pca-region-question.png)](../assets/current-workspace/19-pca-region-question.png)

精巧的选区控件暂存针对六个 PCA 映射点的问题。受支持的映射将选区连回已注册的来源证据；仅有图像的选区不能提供缺失的样本身份。本图展示的是**问题草稿**，不是已提交回答，也没有要求排除样本。

[用图形审阅证据](../guides/images-and-result-actions.md)

## 05. 讨论上传的图片

[![上传两张 cfRNA 图形，并获得实际完成的解释。](../assets/current-workspace/35-uploaded-images-and-answer.png)](../assets/current-workspace/35-uploaded-images-and-answer.png)

没有附加数据集的新对话也能讨论上传的 PCA 和热图。已完成的回答解释两类图形的单位差异与解释边界。上传 PNG 不会重建来源映射，也不能据此证明癌症可被诊断。

[尝试图片提问](workspace-walkthrough.md)

## 06. 审阅可复用指导

[![报告指导修改提案，配有精巧的接受和拒绝按钮。](../assets/current-workspace/27-review-reporting-diff.png)](../assets/current-workspace/27-review-reporting-diff.png)

报告偏好生成可阅读的修改提案。接受或拒绝前，用户可以检查新增与删除内容；智能体起草修改不等于已经应用。保留的指导仍包含必要的科研约束。

[了解专业技能](../guides/professional-skills.md)

## 07. 综合不同会话

[![链接会话读取原来注册的质控摘要并进行比较。](../assets/task-linking/combined-question.png)](../assets/task-linking/combined-question.png)

链接任务将不同会话的上下文和注册结果引用带入新讨论。本次回答比较已有的两份质控摘要，没有重新计算，并解释这两张计数矩阵来自**同一队列**，不是两个独立验证队列。

[链接任务并保留本地记忆](../guides/linked-tasks-and-memory.md)

## 08. 切换模型，继续原会话

[![维护后的发布版模型菜单，让本地模型和密钥管理入口始终可见。](../assets/capability-atlas-v0.1/model-menu.png)](../assets/capability-atlas-v0.1/model-menu.png)

维护后的模型菜单把 **Manage local models** 和 **Manage keys** 保留在可滚动选项下方，始终可见。默认仍是 GPT-6 Luna；切换 GPT、Gemini 或已配置的本地模型继续同一会话，保留安全上下文与任务记忆。切换模型并不授权发送额外私有数据或重跑已完成分析。

**界面检查 fixture：**截图使用空的隔离发布工作区、合成模型目录与密钥状态，展示菜单布局，不证明密钥有效、真实 API 调用成功或模型拥有无限上下文。

[配置在线模型与会话连续性](../guides/openai-configuration.md)

## 09. 本地模型管理触手可及

[![发布版本地模型库，展示经过审核的名称和安装控件。](../assets/capability-atlas-v0.1/local-model-library.png)](../assets/capability-atlas-v0.1/local-model-library.png)

**Manage local models** 打开经过审核、依据本机资源筛查的模型库。符合条件的模型支持安装、暂停、继续或放弃；已安装的配置可由用户明确选用。模型存储与科研数据集分开，切换配置会保留已有云端设置。

**隔离发布界面检查：**模型目录与运行时使用测试 fixture；截图展示尚未安装时的模型库，不代表已经下载这些权重，也不代表每个列出模型均通过科研或硬件基准验收。

[安装并管理本地模型](../guides/local-models.md)

## 10. 回到已经完成的工作

[![图片会话位于 Trash 并提供 Restore，研究结果仍被保留。](../assets/current-workspace/33-trash-restore.png)](../assets/current-workspace/33-trash-restore.png)

Results history 保留先前的报告，**Trash → Restore** 将归档会话恢复到任务列表。本图展示隔离图片会话位于 Trash，原研究输入没有被删除。永久删除是另一项独立操作。

[恢复与还原会话](workspace-walkthrough.md)

## 进一步了解发布版本

这些画面展示主要交互闭环，并非所有检测方法的完整基准，也不是临床验证声明。[V0.1 总结](../releases/v0.1.md)明确发布范围，[自然语言示例](natural-language-examples.md)提供英文请求，[真实 cfRNA 图文流程](workspace-walkthrough.md)说明完整科研示例。Docs 语言控件可以将本画廊切换为英文或简体中文；该设置不决定智能体的回答语言。
