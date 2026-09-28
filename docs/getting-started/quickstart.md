<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Your First Analysis

Start after [installation](installation.md). You do not need to write Python
code to use the Web workbench.

For a complete real-data example, use the [GSE174302 illustrated workflow](workspace-walkthrough.md): actual API answers, result-region questions, multi-image input and reviewed skill learning.

## 1. Open the Application

```bash
liquid-agent
```

The browser opens the local agent workbench directly. `liquid-agent client` is
an equivalent entry point; `liquid-agent web` is also supported. Use `liquid-agent cli` for the terminal. The public homepage is for browsing before
installation: its **Try it** link always opens the detailed installation Docs and
does not check for a local workspace.

## 2. Configure GPT

Use the model selector and **Manage keys** to enter your OpenAI API key. Start
with `gpt-6-luna`; `gpt-6-sol` and `gpt-6-astra` are explicit alternatives. The menu shows model names and key status. If authentication
fails, inspect the error and key configuration rather than treating a failed
response as a successful analysis. See [GPT configuration](../guides/openai-configuration.md).

## 3. Attach a Dataset

Choose **New chat**, select a local dataset folder, and wait for the scan to
finish. Keep your data disk mounted while working. Scanning identifies available
inputs; it does not mean an analysis has run.

For a complete example of the interface and review flow, follow the
[illustrated workspace walkthrough](workspace-walkthrough.md). Renaming a file
does not make its assay compatible.

## 4. Ask, Review, Then Authorize

Begin with a focused request such as:

> Inspect these data locally. Explain what they measure, which inputs are
> missing, and propose one useful QC analysis with a figure and a table.
> Do not run it yet.

Review the proposed inputs, prerequisites and plan. If it fits your question:

> Run that QC analysis only. Include the figure, table and a short scientific
> interpretation in the report. Do not start a further analysis yet.

The precise plan depends on your files. A prerequisite question is not a failure:
unsupported or ambiguous data must be clarified, not silently reinterpreted.

## 5. Inspect Results and Continue

Open **Results** and read the report, embedded images, tables and limitations.
Then ask a question grounded in the output, for example:

> Based on this QC, what should I examine next? Explain the evidence first and
> propose a new focused plan. Do not repeat the completed analysis.

New reports and plans retain earlier history. You decide whether to authorize
the next analysis. See the [Web guide](web-ui.md) for report history, changing a
plan, editing a message and stopping an active task.

## Before You Leave

**Stop** interrupts the active job, not the service. Closing the last local Web
page or pressing `Ctrl+C` in the launching terminal can shut down the service.
Keep a page open during a run. Deleting a conversation sends its owned records
to Trash; restoring it is distinct from starting a fresh conversation.

The [CLI guide](interactive-shell.md) provides the equivalent terminal workflow.
CLI interface text remains English even when the website is Chinese.

## If you use a local model

A cloud key is not required for a configured local profile. Use **Manage local models**, select its human-readable name, and check that its server is running. Follow [local-model setup](../guides/local-models.md); installed weights and a successful tool probe do not establish scientific accuracy for every workflow.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 第一次分析

请先完成[安装](installation.md)。使用 Web 工作台不需要编写 Python 代码。

完整真实数据实操见 [GSE174302 图文流程](workspace-walkthrough.md)，包含实际 API 回答、图中选区追问、多图输入和技能审阅。

## 1. 打开应用

```bash
liquid-agent
```

不带子命令默认进入 Web；`liquid-agent web` 仍可用，`liquid-agent cli` 则进入终端。浏览器会直接打开本地智能体工作台，`liquid-agent client` 是等效入口。公开首页供安装前浏览，其 **Try it（开始使用）**链接始终直接打开详细安装文档，不检查本地工作台。

## 2. 配置 GPT

通过模型选择器中的 **Manage keys（管理密钥）**输入 OpenAI API key。默认使用 `gpt-6-luna`，也可手动选择 `gpt-6-sol` 或 `gpt-6-astra`；菜单直接显示模型名和密钥状态。如果身份验证失败，应检查报错与密钥配置，不能将失败回复当成成功分析。详见 [GPT 配置](../guides/openai-configuration.md)。

## 3. 添加数据集

选择 **New chat（新对话）**，添加本地数据集文件夹，等待扫描完成。工作期间请保持数据盘挂载。扫描用于识别可用输入，不意味着已经执行分析。

如果希望先了解完整的界面与审阅流程，请参考[工作区图文教程](workspace-walkthrough.md)。仅修改文件名并不能使数据符合某种检测类型。

## 4. 先提问、审阅，再授权

可以从一个聚焦的请求开始：

> 在本地检查这些数据，解释测量的含义、缺少哪些输入，并提出一项有用的质控分析，包含一张图和一张表。先不要执行。

审阅输入、前置条件及计划。如果符合您的问题，再回复：

> 只执行刚才那项质控分析。在报告里加入图、表和简短的科学解释。暂时不要启动后续分析。

具体计划取决于您的文件。询问前置条件不等于失败：对于不受支持或语义不明的数据，系统应澄清，而不是擅自重新解释。

## 5. 查看结果并继续

打开 **Results（结果）**，阅读报告、嵌入的图像、表格及局限性。然后根据结果提出问题，例如：

> 根据这次质控，下一步应该检查什么？先解释依据，再提出一个新的聚焦计划，不要重复已完成的分析。

生成新报告和计划时会保留此前历史。是否授权下一步由您决定。报告历史、调整计划、编辑消息和停止任务等操作详见 [Web 指南](web-ui.md)。

## 离开之前

**Stop（停止）**中断当前任务，而不是关闭服务。关闭最后一个本地 Web 页面，或在启动服务的终端按 `Ctrl+C`，可能会关闭服务。运行期间请保持页面打开。删除对话会将其自有记录送入回收站；恢复旧对话与新建对话是两种不同操作。

[CLI 指南](interactive-shell.md)提供等效的终端工作方式。即使网站选择中文，CLI 界面仍保持英语。

## 使用本地模型时

已配置的本地模型不需要云端密钥。通过 **Manage local models（管理本地模型）**下载后按名称选择，系统会自动配置并启动所需的托管服务。详见[本地模型配置](../guides/local-models.md)；权重安装和工具探测通过并不能确认所有科研流程的准确性。
