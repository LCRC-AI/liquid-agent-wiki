<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Local data and the remote model

Liquid Agent separates its local scientific workspace from the external GPT API.
The LLM remains the conversational decision-maker; local tools do the data work.

```text
User request -> LLM tool request -> local validated tool
                                      |
                                local data / analysis
                                      |
                             local summary gateway
                                      |
                         aggregate evidence -> LLM reply

Detailed tables and figures -> local report renderer -> user's browser / CLI
```

## What crosses the boundary

The model receives the user's natural-language request, maintained professional
guidance, tool availability, declared assay/value semantics, aggregate dataset
and metadata counts, QC/statistical summaries, execution status, and opaque
resource IDs. A remote model also receives a bounded relevant set of explicitly
remembered preferences marked `remote_allowed`; `local_only` memories stay on
the device. Public literature explicitly retrieved for knowledge work is not
treated as a private dataset.

It does **not** receive file previews, rows of a result table, sequence records,
full matrices, image payloads, arbitrary Markdown/JSON report contents, local
execution logs or metadata identity values from the scientific tools. A CSV
summary is computed locally, not produced by sending CSV text to a second LLM.
Unrecognised fields are omitted rather than forwarded by default.

`read_artifact` now means **summarize this artifact locally**. For bounded CSV/TSV
outputs it reports table dimensions and aggregates of recognised scientific
metric columns. It does not return row lists or arbitrary column names. Mean and
standard deviation require at least two finite observations; missingness and
fixed QC-flag counts remain available. Adjusted-p-value tables can report the
number of features below the declared summary threshold (currently 0.05).
Large/unsupported artifacts return an explicit limitation, not a raw-text fallback.

## What stays fully functional

The model can still choose tools, ask questions, revise a plan, perform an
authorised off-plan analysis, interpret measured aggregate results and propose
progressive follow-ups. It can select `artifact:` IDs for a report without seeing
the underlying records. The local report renderer embeds the selected tables and
figures for the user; large tables use bounded previews with full files retained
locally. The privacy boundary does not remove them.

The boundary introduces no extra approval dialogue or fixed scientific workflow.
If a task needs additional evidence, extend the local scientific summarizer
rather than disable the task or send the dataset to another model. Useful
measurement semantics and statistics should remain available for decisions.

Both Web and CLI use the same gateway. Their result-follow-up controls no longer
append file excerpts to chat. The server also removes excerpts from messages
created by older clients. Task errors are available locally; only a safe error
category and recovery guidance go back to the model.

## Skills and saved conversations

The shared [Local Data Inspection and Model Privacy skill](../reference/skill-catalog.md)
explains what a local inspection should establish and how to use its summaries.
It supplements enforced Python contracts; a prompt or skill cannot override them.
Maintained project skills may be loaded as guidance. Unreviewed personal source
documents and automatically learned observations remain local rather than being
silently uploaded for distillation. Explicit user workflow preferences can still
be phrased conversationally for GPT. Structured memory retains a disclosure flag:
only relevant `remote_allowed` values are included in the workspace snapshot;
their evidence, source task and revision history are not sent.

Personal workflow preferences and skills distilled from explicitly supplied
public URLs remain loadable. For a locally imported professional document, review
and remove any dataset records or identifying information first; setting
`metadata.model_safe: true` in its `SKILL.md` records that local review and makes
its guidance loadable. This flag applies to the skill's guidance/references, not
to dataset files or result tables, and never authorises analysis execution.

An older provider transcript may contain previews created before this boundary.
On migration, Liquid Agent starts a fresh model context and retains local chat,
plans and results. It does not re-upload the old transcript or claim to delete
anything already processed by the provider. New safe conversational history is
kept separately from the local display history.

## Practical limits

This is useful data minimisation, **not formal anonymisation**, a compliance
certification, or a guarantee that all free-text identifiers can be recognised.
Aggregate statistics can still be sensitive. Avoid typing identifiers into chat;
attach local files instead. Pasted structured record blocks are withheld and
common paths, credentials, emails and long nucleotide strings receive basic
redaction. User-entered ordinary prose is still sent to the selected API.

An unsupported summary should prompt a new local summarizer or an honest
limitation, not either a silent upload or a claim that analysis is impossible.
No cross-provider fallback or extra model is introduced by this boundary.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 本地数据与远程模型（中文）

Liquid Agent 将本地科学工作区与外部 GPT API 分离。LLM 仍负责对话决策；数据处理由本地工具完成。

```text
User request -> LLM tool request -> local validated tool
                                      |
                                local data / analysis
                                      |
                             local summary gateway
                                      |
                         aggregate evidence -> LLM reply

Detailed tables and figures -> local report renderer -> user's browser / CLI
```

## 哪些内容会跨越边界

模型接收用户的自然语言请求、维护中的专业指导、工具可用性、声明的检测/数值语义、数据集与元数据汇总计数、QC/统计汇总、执行状态，以及不透明的资源 ID。远程模型还会收到与当前问题相关、数量受限且标记为 `remote_allowed` 的明确用户偏好；`local_only` 记忆留在本机。为知识工作而明确检索的公开文献不作为私有数据集处理。

模型**不会**从科学工具接收文件预览、结果表格中的行、序列记录、完整矩阵、图像载荷、任意 Markdown/JSON 报告内容、本地执行日志或元数据身份值。CSV 汇总在本地计算，不是通过向第二个 LLM 发送 CSV 文本生成。无法识别的字段默认省略，而非转发。

`read_artifact` 现在表示**在本地汇总此产物**。对于规模受限的 CSV/TSV 输出，它报告表格维度和已识别科学指标列的汇总统计，不返回行列表或任意列名。均值和标准差至少需要两个有限观测值；缺失率和固定 QC 标记计数仍可提供。含校正后 p 值的表格可以报告低于所声明汇总阈值（当前为 0.05）的特征数量。过大或不受支持的产物会返回明确限制，不会回退为原始文本。

## 哪些功能保持完整

模型仍可以选择工具、提问、修改计划、执行经授权的计划外分析、解释实测汇总结果，并提出递进式后续分析。它无需查看底层记录，即可为报告选择 `artifact:` ID。本地报告渲染器为用户嵌入选定表格与图形；大表格采用有界预览，完整文件保留在本地。隐私边界不会移除这些结果。

该边界不会引入额外审批对话或固定科学工作流。若任务需要更多证据，应扩展本地科学汇总器，而不是禁用任务或将数据集发送给另一个模型。有用的测量语义和统计信息应继续供决策使用。

Web 与 CLI 使用同一网关。其结果追问控件不再向对话追加文件摘录。服务器也会移除旧客户端创建消息中的摘录。任务错误可在本地查看；仅安全错误类别和恢复指导会返回模型。

## Skills 与已保存对话

共享的[本地数据查看与模型隐私 skill](../reference/skill-catalog.md) 说明本地检查应确认什么，以及如何使用汇总结果。它补充强制执行的 Python 契约；提示词或 skill 无法覆盖这些契约。维护中的项目 skills 可加载为指导。未经审阅的个人源文档和自动学习观察保留在本地，不会静默上传进行提炼。明确的用户工作流偏好仍可用对话形式提供给 GPT。结构化记忆带有披露标记；工作区快照只包含相关的 `remote_allowed` 值，不会发送其原话依据、来源任务或版本历史。

个人工作流偏好及从明确提供的公开 URL 提炼出的 skills 仍可加载。对于本地导入的专业文档，应先审阅并移除数据集记录或身份识别信息；在其 `SKILL.md` 中设置 `metadata.model_safe: true`，记录本地审阅并允许加载指导。此标记适用于 skill 的指导/参考资料，不适用于数据集文件或结果表格，也绝不授予分析执行权限。

旧提供商对话记录可能包含建立此边界之前生成的预览。迁移时，Liquid Agent 会建立全新的模型上下文，同时保留本地聊天、计划和结果。它不会重新上传旧记录，也不会声称已删除提供商处理过的内容。新的安全对话历史与本地显示历史分开保存。

## 实际限制

这是一种有用的数据最小化措施，**不是正式匿名化**、合规认证，也不保证识别所有自由文本标识符。汇总统计仍可能敏感。请避免在对话中输入身份标识，改为添加本地文件。粘贴的结构化记录块会被拦截；常见路径、凭据、邮箱和长核苷酸字符串会进行基础脱敏。用户输入的普通文本仍会发送至选定 API。

不受支持的汇总应促使系统新增本地汇总器或如实说明限制，而不是静默上传，也不是声称分析不可能完成。该边界不引入跨提供商回退或额外模型。
