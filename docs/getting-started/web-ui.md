<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Web UI

The project has a public static homepage and bilingual Docs, plus an installed
**local single-user** agent workspace. The workspace uses the same agent logic as
the terminal shell. Scientific computation runs locally; configured model requests and explicitly requested external retrieval can use the network.

The React application does not implement a separate scientific decision tree.
It sends the conversation thread ID and user request to the Python service, which
invokes the same LangGraph interaction and analysis runtime used by the CLI. The
browser is responsible for presentation, streaming progress, and user controls;
the backend remains responsible for intent, planning, tool selection, execution,
verification, and replanning.

`liquid-agent`, `liquid-agent web` and `liquid-agent client` all open the local agent workspace
directly at `/#/agent`.

- **Public website:** publish the homepage and Docs to GitHub Pages for visitors
  to browse before installation. **Try it** always opens **Getting Started >
  Installation** in the selected language. No local-service probing is performed.
- **Local application:** launch the installed workspace with `liquid-agent web`.
  Use `liquid-agent wiki` (also `liquid-agt wiki` or `liq wiki`) to open the separately deployed public homepage and Docs. In the interactive CLI, type `wiki` or `/wiki`; `portal` remains a compatible alias.

## Portal

The portal includes:

- a Codex-inspired hero section with a **Try it** installation link
- a start planner that maps new visitors, data-ready users, result reviewers, and team leads to the right command, guide, and proof point
- an interactive product-surface explorer that connects the public portal, browser client, terminal CLI, and Python analysis kernel
- clickable product concepts such as local-first execution, source-aware planning, recoverable autopilot, and professional skill memory
- a launch-path selector that explains when to use the portal, direct client, terminal CLI, or short `liq` alias, with copyable commands and matching guide links
- an evidence-flow explorer that shows how a selected public-style example moves from source detection to plan, run, review, and auditable receipts
- a capability atlas that lets users choose by signal family, then jump directly to the matching Gallery example or Guide
- a method advisor entry for fragmentomics, methylation, CNV, variant, cfRNA, small-RNA, CTC-table, and plasma-proteomics method questions
- a trust-contract section that states data boundaries, model-call boundaries, example status, run receipts, and safe failure behavior before users enter the agent console
- a Try it installation link that works consistently for public visitors and local portal previews
- an example gallery with public liquid-biopsy workflows, including real local runs where available and guided walkthroughs where full local data are not required, a workflow overview, selectable examples, dataset cards for public reference, access status, run status, local run hint, input shape, intended outcome and caveat, copyable sample prompts, matching guide links, a run-receipt panel for `Source / Control / Outputs / Review`, a visible run package for brief/table/figure/next-action deliverables, transformed working traces, an operation playbook for `Attach / Scan / Plan / Run / Review / Refine`, and `Chat / Plan / Results / Artifacts` run views
- a setup-path selector that separates one-click Mac install, terminal install, Web workspace launch, and direct workspace launch, each with a copyable command, result summary, and matching guide link
- an interactive guide system for install, data attachment, planning/autopilot, result inspection, and LLM routing, including a concept map for command shims, source model, safe autopilot, result receipts, model routing, public handoff, a method atlas that maps preprocessing, encoding, cfDNA analysis, professional skills, public datasets, and interfaces back to the full docs, a start chooser for common user intents, an onboarding flow rail, outcome cards, copyable command rails, related examples, and previous/next guide navigation
- a Vision page with clickable operating principles, proof points, a project map, role-scenario explorer, related product links, and team operating model
- a shared footer with site-map links, example shortcuts, and the core local launch commands so users do not get stranded at the bottom of long pages

The gallery and guide system are independent portal subpages, not just homepage
sections:

```text
/#/gallery
/#/gallery/<example_id>
/#/guides
/#/guides/<guide_id>
```

This keeps the public portal navigable like a product website while preserving
the local agent console at `/#/agent`.

The examples are guided walkthroughs unless explicitly marked as completed local
validation runs. Current completed local validation examples include `GSE171434`
raw-signal bigWig review, `GSE186573` supplied CNV matrix review, `GSE186575`
supplied methylation matrix review, and `GSE214344` EPIC-like methylation matrix
review, plus `msk_access_2021` variant/VAF review when the data disk is mounted.
The examples mirror the real interaction
pattern: user prompt, agent response, task plan, report preview, artifact list,
result table, and visualization preview. Each detailed example also starts with
a dataset card that states the public-style reference, access status, run status,
expected input shape, local run hint, validation target, and caveat before
showing results. The operation playbook then explains how a user controls the
local agent, what output should appear, and which guide covers that step. The
Gallery page starts with a compact workflow map so users can choose by signal
family instead of guessing which example to open first.

## Interface Language

Select **English** or **Chinese** using the globe selector in the portal navigation
or the workspace header, next to **Colour theme**. Expand the left workspace panel
first if it is collapsed. Only one interface language is displayed at a time.
English is the default for the portal, workbench and language-neutral Docs entry,
even with a Chinese browser or operating system. Chinese is an explicit option;
the browser remembers your choice across pages and reloads
and synchronises it between tabs on the same origin. A publicly hosted portal and
the localhost app have separate browser preferences.

Switching language does not reload the page, create a new conversation, clear a
draft, change the GPT model, or interrupt a running task. If browser storage is
blocked, switching still works for the current page. CLI output stays English.

This setting translates interface copy, navigation, dialogs, built-in skill names,
status labels and controls, not scientific content. It does not set the Agent's
response language or add a language instruction to model requests. The model
chooses its language from the conversation and your instructions. User messages, GPT responses,
report text, tables, figure labels, runtime skill documents, file paths and commands
remain unchanged. You may ask GPT to answer in Chinese independently of this
setting; no automatic translation call or extra data upload is performed.

## Colour Themes

Use **Colour theme** in the portal navigation or alongside **LIQUID-Agent** in the
workspace header. The available palettes are **Soft sage** (default),
**Soft rose**, **Light blue**, and **Warm stone**. On narrow portal screens,
the same selector is shown as a compact coloured swatch next to **Try it**.
Expand the left workspace panel to reach the selector when the panel is collapsed.

Only interface colours change: backgrounds, borders, text accents, and controls.
Panel layout, conversation state, analysis settings, and the colours encoded in
scientific figures do not change. Selecting a theme makes no LLM request and
does not restart the service or run an analysis.

The preference is stored in this browser for the current site address, survives
reloads, and synchronises between open tabs on that same address. Different
browsers, ports, and devices have separate preferences. Clearing site storage
restores Soft sage; if storage is disabled, a selection still works for the current
page but cannot be remembered after a reload. Local font assets are bundled with
the interface rather than downloaded from an external font service.

## Sidebar and Trash

The workspace heading is **LIQUID-Agent**. Compact language and colour selectors sit alongside it at the default desktop width and wrap when the sidebar is too narrow. Trash is a compact disclosure card: open it to restore a conversation or request permanent deletion. There is no separate idle/status footer.

Skills use compact, single-line rows. The small group arrow expands the hierarchy;
the name opens the full guidance. Long names pan on hover or keyboard focus only
when they overflow; widening the sidebar removes the need to pan. The full name
also remains in the tooltip. Reduced-motion preferences disable this animation.

Selecting a skill opens a separate reading column between the workspace and the
conversation, with a sliding transition. On desktop, the conversation and results
narrow proportionally without changing their saved widths. Close with the upper
right cross or Escape. Small buttons below the document open its references
or ask GPT to discuss the selected skill. The guidance page shows no reload/overview
button; **Back to skill guidance** appears only when a reference document is open.
The current reference never links to itself; only other references remain available.
Reading a skill or its references is local and does not run an analysis or call GPT. Discussion
is a normal model-backed conversation turn, not permission to execute the skill.
On phones, the reader is a sliding sheet instead of four unreadably narrow columns.

**Save a reusable note** stores a user-authored method rule or personal preference
for later tasks, separately from the maintained project skills. **Learn from a
file, folder, or URL** extracts reusable guidance from reference documents; it does
not install an analysis engine or analyse a dataset. Use non-sensitive reference
material rather than patient measurements. These optional controls are not needed
to use the built-in skills.

Desktop Sources, Skills and Plan expand upwards, so a closed panel shows an up
arrow and an open panel shows a down arrow. Results expand downwards and use the
opposite arrows. On mobile, Sources and Skills follow downward document flow and
their arrows adapt accordingly.

Conversation indices are stored at `<data-root>/.liquid-agent/conversation-index/`:

```text
active/<chat-hash>.json
trash/<chat-hash>.json
deleted/<chat-hash>.json
```

Moving to Trash transfers the full index, including its saved UI snapshot, from
`active` to `trash`. After active writers stop, the entire conversation-owned output
tree (including intermediate files, reports, figures and uploads) moves to
`<data-root>/.liquid-agent/trash/conversations/<chat-hash>/`. With a custom output
root, Trash sits alongside that root under `trash/conversations/` on the same disk.
Original dataset files and other conversations stay in place. Restore moves the
owned tree back to its original paths and restores the index. Permanent deletion removes the full index,
owned results/uploads and runtime history; `deleted` retains only a hash-named
guard with no messages, titles, paths or results to reject delayed requests.

Private Codex history and LangGraph checkpoints also live under
`<data-root>/.liquid-agent/`. Restart the local service after upgrading; do not run
old and new service versions concurrently during migration. Existing configuration-
directory indices and runtime state migrate without relocating raw inputs or
existing output directories. Skills and API-key configuration do not move to the
data disk. `LIQUID_BIOPSY_TASK_STATE_ROOT` can explicitly override the state root.
Without an explicit data-root override, a small configuration pointer remembers
the chosen disk; if that disk disappears, reconnect it instead of silently creating
a second local task store. Offline storage returns a readable, retryable error.
On reopening or refocusing the page, cached task IDs are reconciled with disk
Trash/deletion records so removed tasks cannot return from an old browser cache.
If a dataset cannot be restored, cached results and plans are not shown as active.

## Agent Console

Run `liquid-agent web` to open the agent console directly. The console is
designed around three lightweight regions:

- a left workspace panel for chats, attached Sources, the compact Metadata card,
  and local Skills/preferences
- a central conversation panel for natural-language interaction, live workflow
  status, and final run summaries
- a right workspace panel for Results and Plan history, including readable
  reports, embedded figures, key markdown tables, generated artifacts, and
  archived plan versions

The side panels are resizable. Conversations and lightweight UI state are saved in
browser local storage, so reopening the app restores the local chat/workspace view
when possible.

After **Run next step** completes, the client refreshes result artifacts and
regenerates the next plan automatically. The preview area is markdown-first: the
selected run report is the main user-facing artifact, with key result tables and
static PNG figures rendered inside the report when available. Backend JSON/TXT
artifacts and generated HTML pages are hidden from the default user view unless
they are needed for audit, follow-up, or developer inspection. Ledger artifacts
such as plan records, result evaluations, and `analysis_concept_book.json`
remain available to the backend and CLI follow-up path, but they do not create
extra UI modes.

Plan and result follow-up answers summarize plan state, task execution,
verification, QC, findings, follow-ups, and backend recommendation audits in
plain language instead of exposing raw JSON. When the LLM is disabled or
temporarily unavailable, local fallback guidance chooses the next suggested
action from artifact type and scan state.

## Install

Recommended local install:

```bash
./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data"
```

Equivalent terminal form:

```bash
./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data"
```

Then run:

```bash
liquid-agent web
liquid-agent client
```

The portal Install section mirrors the same decision tree:

| Path | Use it when | Command |
| --- | --- | --- |
| One-click Mac | a local user opens the file from Finder and enters the user data directory when prompted | `./install_liquid_agent.command` |
| Terminal install | a workstation or remote shell needs explicit setup logs | `./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data"` |
| Web workspace | an installed user wants to chat, attach data, and analyse | `liquid-agent web` |
| Direct work | a returning user wants the agent workspace immediately | `liquid-agent client` |

The launcher calls the same Python analysis kernel behind the scenes. The
installer captures the active user environment, so users do not need to activate
that environment before running `liquid-agent web` or `liquid-agent client`. Use `LIQUID_AGENT_ENV=<env>`
only if you intentionally want another conda environment.

## One-Click Launcher

On macOS, the repository also includes:

```bash
start_liquid_web.command
```

Double-clicking that file starts the local server through the same npm launcher
and opens the browser. The server is configured for local use and shuts down
after the browser page is closed.

Stopping a task is different from closing the page: a stop request terminates
the active scientific child process group and leaves the local service available
for the next message or an explicit resume. Closing the final local client page
shuts down the service and its active jobs so no analysis process is left behind.

## Browser Commands

```bash
liquid-web
liquid-client
```

`liquid-web` aliases `liquid-agent web`; `liquid-portal` aliases `liquid-agent portal`.
`liquid-client` is an npm alias for `liquid-agent client`. By default the local app listens on
`http://127.0.0.1:8765` with API routes under `/api/...`. Both browser commands
open the browser automatically unless `--no-open` is passed or
`LIQUID_AGENT_NO_OPEN=1` is set.

Use a different port when needed:

```bash
liquid-agent web --port 8771
liquid-agent client --port 8771
```

## How To Work In The Agent Console

After installation, run `liquid-agent web` or `liquid-agent client`. The browser
opens the workspace directly. Start from **New chat**; the app asks whether to
bind a dataset immediately:

- choose a folder with the native folder picker when the data path is known
- paste a path manually when the folder picker is not available
- choose **Set up later** for pure chat or orientation questions

If a later chat message clearly identifies a dataset path, the UI creates or
updates the corresponding dataset workspace and associates the conversation with
that workspace.

The left **Sources** card shows the data folders explicitly attached by the
user. Selecting a parent folder is displayed as one user source; the kernel may
still inspect internal subfolders or sub-cohorts for analysis planning without
turning the sidebar into a confusing list of internal partitions. Explicit
multi-source analysis is still supported by adding multiple folders. Removing a
source detaches it from the session and never deletes source data.

Adding a source performs a lightweight scan and writes a short chat summary:
what was attached, how many files were scanned, whether metadata labels were
selected, and whether a plan has already been started. The user can then ask for
a plan, type `/plan`, or continue naturally. A run cannot be started until a
real plan exists.

After a source is attached and scanned, the conversation header exposes
**Method advice**. This writes a method-advice report for the current source set,
refreshes the result artifacts, and adds a short chat summary with the top
matched methods and the report path.

The compact **Metadata** card appears below Sources when metadata or label state
is known. It shows the selected label, coverage, planning mode, backend,
confidence, and Change/Ignore controls. The card intentionally does not show a
full spreadsheet; detailed label selection belongs in the Change dialog or the
CLI `/metadata` command.

Existing conversations can be selected, deleted, or rebound to a dataset. The
bind action is intentionally small and appears with the other hover actions on a
conversation row.

## LLM Selection

The composer model button uses the available model catalog: OpenAI GPT by default, with optional Gemini 3.8 Flash.
GPT-6 Luna (`auto`) is the default; GPT-6 Sol and GPT-6 Astra are explicit higher-cost
choices. The current model cannot be changed while an operation is busy.
Manage keys opens a provider-selectable dialog for adding, replacing, or deleting the
key. A failed save keeps the dialog open and shows the error.

Credentials are kept in an owner-only local file, never in browser storage.
Deletion disables subsequent requests, including from existing clients, without
falling back to an environment key. An already submitted OpenAI request cannot
be retroactively unsent. Gemini has a separate key and a free-tier/privacy notice before activation; use public or non-sensitive synthetic data only. See [OpenAI configuration](../guides/openai-configuration.md).

## Conversation Behavior

- `Enter` submits a prompt.
- During Chinese/Japanese/Korean IME composition, `Enter` first confirms the
  composed text instead of submitting the prompt.
- `Shift+Enter` or `Ctrl+Enter` inserts a newline.
- While the assistant is responding, the send button becomes a stop button and
  new submissions are blocked.
- User messages can be edited. **Save and resend** truncates later messages and
  asks the assistant again from that edited point; it is not a local-only save.
  The editor receives keyboard focus and uses readable theme colours. **Cancel**
  or `Escape` discards the draft without changing the original message; blank
  edits cannot be submitted.
- The UI shows transformed progress summaries and loading indicators. It does
  not expose private model chain-of-thought.
- When a plan or long run is active, the status card stays near the bottom of
  the conversation area. Recent working notes are shown as a bounded, transient
  live feed instead of accumulating as permanent chat bubbles.
- The stop control requests cancellation through the backend job endpoint. The
  current safe checkpoint can finish before the run exits, and the completed
  report records whether the run stopped, completed, or blocked.

## Results Panel

The right panel stays compact until needed. After scanning or running a task it
can show:

- result history grouped by run or report
- the selected markdown report with embedded key tables and static figures
- plan history from `assistant/ledger/plan_*.json`
- the current runnable plan and archived previous plans
- generated artifacts when the report links to them or the user needs audit
- image previews for generated figures
- result history, hide/restore, and safe deletion for generated output files
- method-advice reports when the user asks which tools, research methods, or assay-specific routes fit the dataset

Deleting a generated report from Results also removes the associated generated
files recorded in the report metadata when those files are inside recognized
Liquid Agent output folders. It does not delete original source data.

The panel can be dragged wider when inspecting tables or plots.

Figures in reports and individual image results have an embedded image viewer.
Use **Zoom in** / **Zoom out**, or click the percentage to reset the zoom.
The top-right **Fit to width / Fit to height** button switches between a detailed
width-filling view and a height-filling overview with a smooth transition.
Scroll or drag enlarged figures to inspect them. With the image area focused,
`+` / `-` zoom, `0` resets, and `F` switches the fit. Reduced-motion preferences
are respected. **Choose folder** opens a folder browser at the configured data root.
Double-click a folder (or use its arrow) to browse inside; select a folder and
click **Open** to attach it. **System folder picker…** remains available for
locations outside the data root. Cancelling leaves the conversation unchanged.

## Data root

Paths are resolved the same way as the CLI: set `LIQUID_BIOPSY_DATA_ROOT` (or use
the optional `data_root` field when creating a session via the API) for stable
defaults. Absolute user-selected folders can also be attached directly; relative
dataset names are resolved under the configured data root.

For example, a user may point the data root at any mounted folder:

```text
/path/to/your/liquid-agent-data
```

On ordinary user machines without that disk, Liquid Agent falls back to a local
application-data folder unless `LIQUID_BIOPSY_DATA_ROOT` is set.

The UI also supports working without the data disk for pure chat, orientation,
LLM setup, and documentation-style questions.

## Notes

- Full scan / autopilot paths load the same Python stack as the assistant,
  including optional model and file-IO dependencies when those extras are
  installed in the kernel environment.
- The web layer calls the same autopilot engine as the interactive shell, with
  optional `event_callback` / `cancel_event` hooks for streaming progress.
- Source-management API routes are available under
  `/api/session/{session_id}/sources` for local UI integrations.
- Web result routes are available under `/api/session/{session_id}/results`,
  `/api/session/{session_id}/file`, and `/api/session/{session_id}/artifact`.
  The delete route only removes files already recognized as generated Liquid
  Agent outputs for the current session.
- Long runs use `/api/session/{session_id}/autopilot`,
  `/api/jobs/{job_id}/events`, and `/api/jobs/{job_id}/cancel` for streaming
  status and safe stopping.
- The browser state is local to the browser profile. Clearing browser storage
  removes saved chats and UI layout state but does not delete analysis outputs
  on disk.

## Task activity and reviewed skills

A spinning circle beside a task means it is running. If it finishes while you are in another conversation, a blue dot remains until you open that conversation. The dot means that the task needs your attention, not necessarily that it succeeded: read the final response for failure or cancellation. Sources attached to a running task have an accent border; this does not imply that every attached dataset is being computed at that instant.

**Skill changes** stays at the turn that produced the draft, including after acceptance or rejection. Later messages scroll it into history. Pending changes also have small green check/red cross actions at the **right end** of the corresponding Skills row. Click the skill name to review the diff. These indicators apply to the selected conversation; open the relevant task to review its drafts.

See the [illustrated workspace walkthrough](workspace-walkthrough.md) for current full-interface screenshots, key management, multi-image questions, and the workflow from Plan to Results.


## Follow a real operation, not just a feature list

The [GSE174302 walkthrough](workspace-walkthrough.md) follows one study through folder selection, metadata checking, skill reading, plan approval, six scientific jobs, Results actions, mapped PCA questions, a two-figure follow-up, skill accept/reject and corrected reporting. A separate image-only chat demonstrates uploading two real PNGs; it also supplies the Trash/restore example. Every new screenshot comes from that actual API-backed browser session.

For individual steps, use [image and selection screenshots](../guides/images-and-result-actions.md#live-example-two-figure-follow-up) and [skill-review screenshots](../guides/professional-skills.md#live-review-example). Additional assay prompts in the [scenario collection](natural-language-examples.md) are labelled as templates where they were not executed here.

## Compact sidebar states

The expanded left sidebar shows the LIQUID-Agent logo button. Collapsing it replaces the logo with an expand-panel icon; beneath it a single **+** starts a new task. Task selection controls are hidden in this narrow state. Clicking **Trash** expands the sidebar to show the full recycle-bin list. Expand the sidebar to select and link tasks. The sidebar widths remain your saved widths across refreshes.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# Web 用户界面（中文）

项目包含公开的静态首页和双语 Docs，以及安装后的**本地单用户**智能体工作台。工作台与终端 Shell 使用同一套智能体逻辑，科学计算在本地运行，配置的模型请求和用户明确要求的外部资料检索可以使用网络。

React 应用不实现独立的科学分析决策树。它将对话线程 ID 和用户请求发送给 Python 服务，由该服务调用与 CLI 相同的 LangGraph 交互和分析运行时。浏览器负责界面展示、流式进度和用户控件；后端仍负责意图理解、规划、工具选择、执行、验证和重新规划。

`liquid-agent web` 和 `liquid-agent client` 都直接在 `/#/agent` 打开本地智能体工作台。

- **公开网站：**将首页和 Docs 发布到 GitHub Pages，供访客在安装前浏览。**Try it** 始终直接打开所选语言的**入门 > 安装**页面，不探测本地服务。
- **本地应用：**使用 `liquid-agent web` 启动已安装的工作台。使用 `liquid-agent wiki`（也可用 `liquid-agt wiki` 或 `liq wiki`）打开单独部署的公开主页和 Docs。在 CLI 中输入 `wiki` 或 `/wiki` 也可打开主页；`portal` 保留为兼容入口。

## 门户

门户包括以下内容：

- 受 Codex 启发的首页主视觉区，以及**Try it** 安装链接。
- 入门路径规划器，为首次访问者、已备好数据的用户、结果审阅者和团队负责人匹配适当的命令、指南和验证示例。
- 交互式产品界面浏览器，串联公共门户、浏览器客户端、终端 CLI 和 Python 分析内核。
- 可点击的产品概念，包括本地优先执行、感知数据源的规划、可恢复的自动执行，以及专业技能记忆。
- 启动路径选择器，解释何时使用门户、直接客户端、终端 CLI 或简短的 `liq` 别名，并提供可复制的命令和相应指南链接。
- 证据流浏览器，展示选定的公共数据风格示例如何从数据源识别进入规划、运行、审阅和可审计的执行凭据。
- 能力图谱，允许用户按信号类型选择，再直接跳转到对应的 Gallery 示例或 Guide。
- 方法顾问入口，用于片段组学、甲基化、CNV、变异、cfRNA、小 RNA、CTC 表格和血浆蛋白质组学相关的方法问题。
- 信任约定区，在用户进入控制台之前说明数据边界、模型调用边界、示例状态、运行凭据和安全失败行为。
- 公开访客和本地首页预览行为一致的 Try it 安装链接。
- 公共液体活检工作流示例库：有条件的示例提供真实本地运行，不要求完整本地数据的示例提供引导式演练；包括工作流概览、可选示例、标明公共参考来源的数据集卡片、访问状态、运行状态、本地运行提示、输入结构、预期结果与限制、可复制的示例提示词、相应指南链接、`Source / Control / Outputs / Review` 运行凭据面板、展示简报/表格/图形/下一步操作交付物的运行包、经过整理的工作轨迹、`Attach / Scan / Plan / Run / Review / Refine` 操作手册，以及 `Chat / Plan / Results / Artifacts` 运行视图。
- 安装路径选择器，区分 Mac 一键安装、终端安装、Web 工作台启动和兼容客户端入口，每条路径均提供可复制命令、预期结果摘要和相应指南链接。
- 交互式指南系统，涵盖安装、附加数据、规划/自动执行、检查结果和 LLM 路由；包括命令包装器、数据源模型、安全自动执行、结果凭据、模型路由和公共门户跳转的概念图，将预处理、编码、cfDNA 分析、专业技能、公共数据集和接口映射回完整文档的方法图谱，以及常见用户意图入口、新手操作流程、结果卡片、可复制命令栏、相关示例和上一篇/下一篇指南导航。
- Vision 页面，提供可点击的运行原则、验证依据、项目地图、角色场景浏览器、相关产品链接和团队运行模式。
- 共享页脚，提供站点地图链接、示例快捷入口和核心本地启动命令，避免用户在长页面底部找不到下一步。

示例库和指南系统是独立的门户子页面，而不只是首页中的区块：

```text
/#/gallery
/#/gallery/<example_id>
/#/guides
/#/guides/<guide_id>
```

这样既能让公共门户像产品网站一样便于导航，又能保留位于 `/#/agent` 的本地智能体控制台。

除非明确标注为已完成的本地验证运行，否则示例均属于引导式演练。目前已完成的本地验证示例包括 `GSE171434` 原始信号 bigWig 审阅、`GSE186573` 已提供的 CNV 矩阵审阅、`GSE186575` 已提供的甲基化矩阵审阅和 `GSE214344` EPIC 类甲基化矩阵审阅；挂载数据盘时还包括 `msk_access_2021` 变异/VAF 审阅。示例遵循真实交互模式：用户提示、智能体回答、任务计划、报告预览、产物列表、结果表格和可视化预览。每个详细示例都会先展示数据集卡片，在结果之前说明公共参考来源、访问状态、运行状态、预期输入结构、本地运行提示、验证目标和限制。操作手册随后解释用户如何控制本地智能体、应该出现哪些输出，以及哪篇指南覆盖该步骤。Gallery 页面开头提供紧凑的工作流地图，用户可以按信号类型选择，不必猜测应该先打开哪个示例。

## 界面语言

通过主页导航或工作区标题栏中、主题颜色旁的地球图标选择 **English** 或
**简体中文**。如果左侧工作区已收起，请先展开。界面每次只显示一种语言，默认
英语；即使浏览器或操作系统为中文，首次访问主页、工作台和不指定语言的文档入口
仍使用英语。中文需主动选择；浏览器会跨页面和刷新记住选择，并在同源标签页之间同步。公开部署的主页
与本地应用属于不同来源，语言偏好分别保存。

切换语言不会刷新页面、创建新对话、清空草稿、更换 GPT 模型或中断任务。
浏览器禁用存储时，当前页面仍可切换。CLI 输出保持英语。

此设置翻译界面文案、导航、弹窗、内置技能名称、状态和控件，不翻译科学内容。
界面语言不会决定 Agent 的回答语言，也不会向模型请求附加语言指令；模型根据
对话上下文和用户指令自行选择回答语言。
用户消息、GPT 回复、报告正文、表格、图形标签、运行时技能文档、文件路径和命令
保持原样。您可独立要求 GPT 用中文回答；界面切换不会自动调用翻译服务，也不会
额外上传数据。

## 颜色主题

在门户导航栏或工作区标题区域 **LIQUID-Agent** 旁边使用 **Colour theme**。可选配色包括 **Soft sage**（默认，柔和鼠尾草绿）、**Soft rose**（淡玫瑰红）、**Light blue**（浅蓝）和 **Warm stone**（暖石色）。在较窄的门户屏幕上，同一选择器会以紧凑色块的形式显示在 **Try it** 旁边。如果左侧工作区面板已折叠，需要先展开面板才能使用该选择器。

主题只改变界面颜色，包括背景、边框、文本强调色和控件。面板布局、对话状态、分析设置以及科学图形中编码的颜色均不会改变。选择主题不会发起 LLM 请求，不会重启服务，也不会执行分析。

偏好设置按当前网站地址保存在本浏览器中，刷新后仍然有效，并在同一地址的已打开标签页之间同步。不同浏览器、端口和设备各自保存偏好。清除站点存储会恢复 Soft sage；如果禁用了存储，主题选择仍会在当前页面生效，但刷新后无法保留。字体资源随界面本地打包，不会从外部字体服务下载。

## 侧栏与回收站

工作区标志与标题顶部对齐，语言和颜色控件等宽。回收站是紧凑的折叠卡片，展开后
可以恢复对话或请求彻底删除。它与对话列表共用滚动区域；现已移除单独的 idle／底部状态栏。

技能使用紧凑的单行列表。小箭头展开分组，名称按钮打开完整指导。只有名称超宽时，
悬停或键盘聚焦才会滚动文字；拉宽侧栏后若能完整容纳，则不再滚动。完整名称也保留
在提示中。系统的减少动态效果偏好会禁用滚动动画。

点击技能会在工作区和对话之间滑出独立阅读栏。桌面端的对话和结果栏按比例变窄，
不覆盖用户保存的宽度；点击右上角叉号或按 Escape 可收回。正文底部的小按钮用于
阅读参考资料或请 GPT 讨论当前技能。正文页不显示刷新/概览按钮；只有打开参考资料
后才出现“返回技能正文”。参考资料页面不显示当前文件自身的阅读按钮，只保留其他
参考资料入口。阅读正文和参考资料只访问本地，不执行分析或调用 GPT；
“讨论此技能”是正常的模型对话，不代表授权执行技能。
手机端采用滑入阅读面板，避免四列挤在窄屏上。

**保存可复用笔记**用于保存自己编写的方法规则或个人偏好，供后续任务参考，并与
项目维护的技能分开。**从文件、文件夹或网址学习**用于从参考文档提炼可复用指导，
不会安装分析引擎，也不是数据集分析入口。应使用非敏感参考资料，而非患者测量数据。
这两个入口都是可选功能，不使用它们也能正常使用内置技能。

桌面端 Sources、Skills 和 Plan 向上展开，因此收起时箭头向上，展开后箭头向下。
Results 向下展开，箭头相反。手机端 Sources 和 Skills 随页面内容向下展开，箭头
会适配这个方向。

对话索引保存在 `<data-root>/.liquid-agent/conversation-index/`：

```text
active/<chat-hash>.json
trash/<chat-hash>.json
deleted/<chat-hash>.json
```

移入回收站时，将含有已保存 UI 快照的完整索引从 `active` 转移到 `trash`。
等待写入任务停止后，该对话自有的结果、图表、报告、上传附件及中间处理文件整棵目录
搬到 `<data-root>/.liquid-agent/trash/conversations/<chat-hash>/`；自定义输出根目录
使用同盘相邻的 `trash/conversations/`。原始数据集和其他对话保持不动。恢复时将
文件搬回原路径并恢复索引。彻底删除会移除完整索引、该对话自有的
结果/上传附件及运行历史；`deleted` 仅保留以哈希命名的防复活标记，不含消息、标题、
路径或结果，用于拒绝延迟请求。

私有 Codex 历史和 LangGraph 检查点也保存在 `<data-root>/.liquid-agent/`。
升级后需重启本地服务，迁移期间不要同时运行新旧版本。旧配置目录中的索引和运行状态
会迁移，但不搬动原始输入或已有输出目录。Skills 和 API key 配置不会迁入数据盘。
`LIQUID_BIOPSY_TASK_STATE_ROOT` 可显式指定状态根目录。未显式指定数据根目录时，
本机配置中只保存一个位置指针，用来记住选定数据盘；数据盘断开时需要重新连接，
不会悄悄切换到另一套本机任务存储。

## 智能体控制台

运行 `liquid-agent web` 直接打开智能体控制台。控制台由三个轻量区域组成：

- 左侧工作区面板用于对话、已附加的 Sources、紧凑的 Metadata 卡片，以及本地 Skills/偏好设置。
- 中央对话面板用于自然语言交互、实时工作流状态和最终运行摘要。
- 右侧工作区面板用于 Results 和 Plan 历史，包括可读报告、嵌入图形、关键 Markdown 表格、生成产物和已归档的计划版本。

侧边面板可以调整大小。对话和轻量 UI 状态保存在浏览器本地存储中，因此重新打开应用时，会尽可能恢复本地对话/工作区视图。

**Run next step** 完成后，客户端会自动刷新结果产物并重新生成下一轮计划。预览区以 Markdown 为主：选中的运行报告是主要面向用户的产物；如有关键结果表格和静态 PNG 图形，则在报告内显示。后端 JSON/TXT 产物和生成的 HTML 页面默认不向用户展示，除非审计或后续分析需要。计划记录、结果评估和 `analysis_concept_book.json` 等台账产物仍可供后端和 CLI 后续分析路径使用，但不会额外增加界面模式。

计划和结果的后续回答会用自然语言概括计划状态、任务执行、验证、QC、发现、后续方向和后端建议审计，而不是展示原始 JSON。当 LLM 被禁用或暂时不可用时，本地备用指引会根据产物类型和扫描状态选择下一步建议。

## 安装

推荐的本地安装方式：

```bash
./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data"
```

等价的终端形式：

```bash
./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data"
```

然后运行：

```bash
liquid-agent web
liquid-agent client
```

门户 Install 区域使用相同的选择逻辑：

| 路径 | 适用情况 | 命令 |
| --- | --- | --- |
| Mac 一键安装 | 从 Finder 打开文件并按提示输入用户信息目录 | `./install_liquid_agent.command` |
| 终端安装 | 工作站或远程 Shell 需要明确的安装日志 | `./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data"` |
| Web 工作台 | 已安装的用户准备对话、添加数据并分析 | `liquid-agent web` |
| 直接工作 | 返回的用户希望立即进入智能体工作区 | `liquid-agent client` |

启动器在后台调用相同的 Python 分析内核。安装程序会记录用户当前启用的环境，因此运行 `liquid-agent web` 或 `liquid-agent client` 前无需再激活该环境。只有明确希望使用另一个 conda 环境时，才使用 `LIQUID_AGENT_ENV=<env>`。

## 一键启动器

在 macOS 上，仓库还提供：

```bash
start_liquid_web.command
```

双击该文件会通过同一个 npm 启动器启动本地服务并打开浏览器。服务按本地使用方式配置，并在浏览器页面关闭后退出。

停止任务和关闭页面是两种不同操作：停止请求会终止当前科学分析子进程组，但保留本地服务，以便继续发送消息或明确恢复任务。关闭最后一个本地客户端页面时，服务及其活动任务会一并退出，避免遗留分析进程。

## 浏览器命令

```bash
liquid-web
liquid-client
```

`liquid-web` 是 `liquid-agent web` 的别名；`liquid-portal` 是 `liquid-agent portal` 的别名。`liquid-client` 是 `liquid-agent client` 的 npm 别名。本地应用默认监听 `http://127.0.0.1:8765`，API 路由位于 `/api/...`。除非传入 `--no-open` 或设置 `LIQUID_AGENT_NO_OPEN=1`，两种浏览器命令都会自动打开浏览器。

需要时可以使用其他端口：

```bash
liquid-agent web --port 8771
liquid-agent client --port 8771
```

## 如何使用智能体控制台

安装后运行 `liquid-agent web` 或 `liquid-agent client`，浏览器会直接打开工作台。从 **New chat** 开始，应用会询问是否立即绑定数据集：

- 已知数据路径时，使用系统原生文件夹选择器选择目录。
- 文件夹选择器不可用时，手动粘贴路径。
- 如果只想进行纯对话或了解操作方式，选择 **Set up later**。

如果后续消息明确指出数据集路径，UI 会创建或更新相应的数据集工作区，并将对话与该工作区关联。

左侧 **Sources** 卡片显示用户明确附加的数据目录。选择父目录时，界面只显示一个用户数据源；内核仍可检查内部子目录或子队列，用于分析规划，但不会让侧边栏变成令人困惑的内部分区列表。通过添加多个目录，仍可进行明确的多源分析。移除数据源会将其从会话中解除关联，绝不会删除源数据。

添加数据源会进行轻量扫描，并在对话中写入简短摘要：附加了什么、扫描了多少文件、是否选择了元数据标签，以及是否已经启动计划。之后用户可以要求生成计划、输入 `/plan`，或继续自然交流。在真实计划存在之前，不能启动运行。

附加并扫描数据源后，对话标题区域会提供 **Method advice**。它会为当前数据源集合写出方法建议报告、刷新结果产物，并在对话中添加简短摘要，列出最匹配的方法和报告路径。

已知元数据或标签状态时，紧凑的 **Metadata** 卡片会显示在 Sources 下方。卡片展示选中标签、覆盖率、规划模式、后端、置信度，以及 Change/Ignore 控件。卡片有意不显示完整电子表格；详细标签选择应在 Change 对话框或 CLI `/metadata` 命令中完成。

现有对话可以被选择、删除或重新绑定到数据集。绑定操作刻意保持小巧，与对话行上的其他悬停操作一起显示。

## LLM 选择

输入框的模型按钮使用可用模型目录，默认 OpenAI GPT，另可选择 Gemini 3.8 Flash。默认选择 GPT-6 Luna（`auto`）；GPT-6 Sol 和 GPT-6 Astra 是需要用户明确选择的较高费用选项。操作忙碌时不能切换当前模型。Manage keys 会打开可选择服务商的密钥对话框，用于添加、替换或删除密钥。如果保存失败，对话框会保持打开并显示错误。

**Manage local models** 在任何安装模式下都可用。它显示经过审核且按本机资源筛查的
多模态模型，每个模型独立下载，并支持暂停、续传和放弃；放弃会清除该模型的未完成
文件。管理框关闭后，模型菜单继续显示下载进度与控制。完成标记会在第一次选择该模型
后同步消失，Web 会按需启动安装所拥有的本地运行时。模型权重位于安装时指定的用户
信息目录下的 `models/` 子目录，系统自动配置，无需填写参数；既有兼容私有服务器仍可通过 CLI/API 管理。

凭据保存在仅文件所有者可访问的本地文件中，绝不存入浏览器存储。删除密钥后，包括现有客户端在内的后续请求都会被禁用，也不会退回使用环境变量中的密钥。已经提交的 OpenAI 请求无法被追溯撤回。Gemini 使用独立密钥，启用前会显示免费层及隐私提示；仅使用公开或不敏感的合成数据。参见 [OpenAI 配置](../guides/openai-configuration.md)。

## 对话行为

- `Enter` 提交提示词。
- 使用中文、日文或韩文输入法组合输入时，`Enter` 会先确认正在组合的文本，而不是提交提示词。
- `Shift+Enter` 或 `Ctrl+Enter` 插入换行。
- 智能体响应期间，发送按钮变成停止按钮，并阻止新的提交。
- 用户消息可以编辑。**保存并重新发送**会截去后续消息，并从编辑位置重新请求智能体回答，并非仅在本地保存。编辑框自动获得键盘焦点，使用清晰可读的主题配色；**取消**或 `Escape` 会放弃草稿、保留原消息，空白内容不能提交。
- UI 显示经过整理的进度摘要和加载提示，不展示模型私有思维链。
- 计划或长任务正在运行时，状态卡片保持在对话区域靠近底部的位置。最近工作记录以有长度限制的临时实时信息流展示，不会累积为永久对话气泡。
- 停止控件通过后端任务端点请求取消。当前安全检查点可能会完成后才退出；最终报告会记录任务是停止、完成还是受阻。

## Results 面板

报告插图和单独打开的图像均支持内嵌图片查看器。点击放大／缩小按钮调整比例，
点击百分比可重置。右上角“适应宽度／适应高度”按钮平滑切换横向填满和纵向填满；
放大后可滚动或拖动查看细节。聚焦图片区域后，`+` / `-` 缩放，`0` 重置，`F` 切换适应方式。
系统的减弱动态效果设置同样生效。“Choose folder”从配置的数据根目录打开目录浏览器。双击文件夹或点击右侧箭头进入下一级，选中后点击“打开”绑定数据。数据根目录之外的位置仍可通过“系统文件夹选择器…”选择。取消不会改变对话。

右侧面板在不需要时保持紧凑。扫描或运行任务后，它可以显示：

- 按运行或报告分组的结果历史。
- 选中的 Markdown 报告，以及嵌入的关键表格和静态图形。
- 来自 `assistant/ledger/plan_*.json` 的计划历史。
- 当前可执行计划和已归档的旧计划。
- 报告链接到的生成产物，或用户审计时需要的产物。
- 生成图形的图像预览。
- 结果历史，以及生成输出文件的隐藏/恢复和安全删除操作。
- 用户询问适合数据集的工具、研究方法或检测类型特定路径时生成的方法建议报告。

从 Results 删除生成报告时，还会删除报告元数据中记录的关联生成文件，前提是这些文件位于系统认可的 Liquid Agent 输出目录内。该操作不会删除原始源数据。

检查表格或图形时，可以拖宽面板。

## 数据根目录

路径解析方式与 CLI 一致：设置 `LIQUID_BIOPSY_DATA_ROOT`，或通过 API 创建会话时使用可选的 `data_root` 字段，以获得稳定的默认路径。用户选择的绝对目录也可以直接附加；相对数据集名称会在配置的数据根目录下解析。

例如，用户可以将数据根目录指向任意已挂载的文件夹：

```text
/path/to/your/liquid-agent-data
```

普通用户机器没有该数据盘时，除非设置了 `LIQUID_BIOPSY_DATA_ROOT`，否则 Liquid Agent 会回退到本地应用数据目录。

UI 也支持在没有数据盘时进行纯对话、了解操作方式、配置 LLM 和询问文档类问题。

## 备注

- 完整扫描/自动执行路径加载与智能体相同的 Python 软件栈；如果内核环境已安装相应扩展，还会加载可选模型和文件 IO 依赖。
- Web 层调用与交互式 Shell 相同的自动执行引擎，并通过可选的 `event_callback` / `cancel_event` 钩子提供流式进度。
- 本地 UI 集成可通过 `/api/session/{session_id}/sources` 使用数据源管理 API。
- Web 结果路由包括 `/api/session/{session_id}/results`、`/api/session/{session_id}/file` 和 `/api/session/{session_id}/artifact`。删除路由只会移除已被识别为当前会话生成的 Liquid Agent 输出的文件。
- 长任务使用 `/api/session/{session_id}/autopilot`、`/api/jobs/{job_id}/events` 和 `/api/jobs/{job_id}/cancel` 提供流式状态和安全停止。
- 浏览器状态属于当前浏览器配置文件。清除浏览器存储会移除保存的对话和 UI 布局状态，但不会删除磁盘上的分析输出。

## 任务状态与技能审阅

任务名称旁的旋转圆圈表示运行中。若完成时您正在其他对话，任务旁会保留蓝点，进入该对话后自动消失。蓝点表示有完成状态待查看，不保证执行成功：仍需阅读最终回复中的失败或取消信息。运行任务所附加的数据源在 Sources 中有高亮边框，不表示所有已附加数据都在同时计算。

**Skill changes** 保留在产生草案的那轮对话位置，接受或拒绝后也不挪到底部；后续消息会让它滚入历史。待审阅的 Skills 横条**最右侧**显示小绿色勾和红色叉，可直接接受／拒绝，也可点击技能名称查看差异。这里显示的是当前所选对话的草案；查看其他任务的草案需要进入相应对话。

[新版工作区图文操作](workspace-walkthrough.md)提供完整界面截图，并介绍密钥管理、多图提问及 Plan 到 Results 的操作衔接。

## 跟随真实操作，而不只是阅读功能列表

[GSE174302 图文流程](workspace-walkthrough.md)从目录选择、元数据核对、技能阅读、计划审阅开始，完成六项科学任务，再操作 Results 按钮、PCA 选区、双图追问、技能接受／拒绝与报告纠正。独立图片对话演示上传两张实际 PNG，以及垃圾箱恢复。新增截图全部来自这次实际调用 API 的浏览器会话。

分项步骤见[图片与选区截图](../guides/images-and-result-actions.md#live-example-two-figure-follow-up)和[技能审阅截图](../guides/professional-skills.md#live-review-example)。[场景集合](natural-language-examples.md)里本次没有执行的其他检测提问，已明确标为模板。

## 紧凑侧栏状态

左侧栏展开时显示 LIQUID-Agent Logo 按钮；收起后换成展开侧栏图标，下方单独的 **+** 用于新建任务。窄栏隐藏任务选择控件；点击垃圾桶会展开侧栏并显示完整回收站列表。先展开侧栏，再选择并链接任务。刷新页面仍保留之前保存的栏宽。
