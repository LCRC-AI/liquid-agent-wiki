<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Installation

[Join the Waitlist](https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=as2-rtQxAUuVzoJ0r-hT2crr7c84XABNtm_gHP1xL7VUN0owN1JPSFlaRzlCWVlCME1IMTNKWFlENC4u){ .md-button .md-button--primary target="_blank" rel="noopener noreferrer" }

After your early-access application is approved, download and extract the package
provided in your invitation, or clone it using the access details supplied to you.
Keep this folder after the first installation; the launcher uses its code until
the first successful update moves the application into managed versions.
Python 3.11+ (3.12 recommended) and Node.js/npm must already be installed.
The installer does **not** install Python or Node.

## Packaged installers and open source { #packaged-installers-and-open-source }

We plan to provide packaged installers that let you install LIQUID-Agent with a
click. After the testing phase is complete, we will make the software open source.
The open-source version will receive project updates sooner than packaged releases.

The guide below covers installation from source for the open-source version.
During testing, use the source package or repository access provided to you.

## One-command installation

Open a terminal in the extracted repository. If you use conda or a virtualenv,
activate the environment you want **before** running the installer. All application
Python dependencies are installed with that interpreter. Without an activated
environment, the installer uses the Python on your PATH. It does not switch to a
different application environment or bypass an OS-managed Python's protections.

macOS (Terminal or Finder):

```bash
./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data"
```

Linux:

```bash
bash install_liquid_agent_linux.sh --user-data-dir "$HOME/Liquid Agent Data"
```

Windows (PowerShell or Command Prompt):

```powershell
.\install_liquid_agent_windows.cmd -UserDataDir "D:\Liquid Agent Data"
```

The Windows file applies a process-only PowerShell execution-policy override and
delegates to the Windows installer. The Linux and macOS files only invoke the
POSIX installer; Windows-specific command and PATH handling stays in the shared
Python installer's Windows branches.
The user data directory is required in both cloud and local modes. Choose a
dedicated folder outside the repository. If you omit the path while running it
in a terminal, the same installer asks you to enter one. The installer creates separate `credentials/`, `memory/`,
`skills/`, `tasks/`, and `models/` folders there. It remembers the selected path
in each launch command. Upgrading the application does not replace this data.
For an explicit interpreter, use `LIQUID_AGENT_PYTHON=/absolute/path/to/python` on
macOS/Linux, or `-Python C:\path\to\python.exe` in PowerShell. Advanced conda users can
set `LIQUID_AGENT_ENV` to an existing named environment.

The installer installs Python dependencies, builds the Web interface and bilingual
docs, creates private user directories, and registers launch commands. Open a new
terminal after installation. The commands remember the installation interpreter;
conda installations automatically enter the captured environment by its prefix.
A renamed/deleted environment requires reinstalling the launch commands.

```bash
liquid-agent       # Web workspace
liquid-agent cli   # Terminal interface
liq                # Short alias for Web
liquid-agent wiki  # Project homepage and documentation
```

`liquid-agent web` and `liquid-agent client` also open `/#/agent`. The public
homepage's **Try it** opens this installation guide directly and does not check
for or launch a local workspace. To enter an installed workspace, use the URL
printed by the launcher. For a custom port, use `liquid-agent wiki --port YOUR_PORT`
or the running service's URL.

## Optional local model installation

Omit `local` to install for cloud LLM use. No model menu or weight download is
started. To install a local model, use the same selected user data directory.
Models are placed in its `models/` child:

```bash
bash install_liquid_agent_linux.sh --user-data-dir "$HOME/Liquid Agent Data" local
```

```powershell
.\install_liquid_agent_windows.cmd local -UserDataDir "D:\Liquid Agent Data"
```

On macOS, use `./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data" local`.

A missing or relative user data path is an error before dependency installation.
Quote paths containing spaces. This is private application storage, not the
research-data disk selected later in the workspace.

The CLI menu lists reviewed multimodal Ollama candidates, download sizes and
estimated working memory. Enter a number; OS, available RAM/VRAM and disk checks
reserve room for scientific work. Native Ollama downloads the selected vision
model and projector, applies the planned context and runs a basic tool/result
probe. Assess multi-image, conversational and long-task performance on the machine
where you will use the model.

For an 8 GiB GPU, the default 32K-context Qwen3.5 4B estimate may exceed the
reserved VRAM budget. A shorter context can be requested explicitly with a JSON
model list containing `[{"model":"qwen3.5:4b","context_tokens":24576}]`, then
`install_liquid_agent_windows.cmd local -UserDataDir "D:\Liquid Agent Data" -ModelsList "C:\path\to\models.json" -Yes`.
This changes the capacity estimate and the installed model context; it is not a
guarantee that the model will load or support the full scientific tool catalog on
every 8 GiB device. Reduce other memory use and choose a larger context when the
complete Web conversation does not fit.

Text-only Qwen3 GGUF choices have been removed. Eligible candidates include
Qwen3.5 4B/9B, Qwen3.8 27B and Muse Glimmer 30B, based on their official model
cards and subject to capacity checks. Existing profiles and keys are preserved.
See [Local Language Models](../guides/local-models.md). A successful installation
probe does not establish scientific accuracy or long-task reliability.

Local installation preserves cloud keys and model pins. Switch between cloud and
local profiles in the Web model menu or CLI whenever needed. Web-managed installs
start their owned Ollama service when the user selects the installed model. For a
CLI-only session, use `liquid-agent local-models serve`, then select its profile.
When the last Web page closes, Liquid Agent asks this owned Ollama server to exit.
An independently installed or user-started Ollama is never stopped by this action.

Advanced automation can use `--user-data-dir PATH --with-local-models --model MODEL --yes` (PowerShell: `-UserDataDir PATH -WithLocalModels -Model MODEL -Yes`). The legacy
`--models-dir` flag remains supported only when it equals `PATH/models`. Installer `--dry-run` / `-DryRun` only skips model
provisioning; it still installs dependencies and commands. For a model-only plan:

```bash
python -m liquidbiopsy_agent.local_setup setup --models-dir /absolute/path/models --dry-run
```

## Update on macOS, Linux and Windows

The application checks for a newer stable GitHub Release when the local Web
workspace opens. An available release appears in a dismissible notice. Closing
it keeps the current version; **Check for updates** remains available in the
workspace. The notice only offers the terminal command and release notes. It
never installs automatically.

```bash
liquid-agent update --check
liquid-agent update
liquid-agent update --rollback
```

From the original repository folder, the equivalent scripts are
`./update_liquid_agent.command` on macOS and
`bash update_liquid_agent_linux.sh` on Linux, or
`.\update_liquid_agent_windows.cmd` on Windows. The updater uses the latest stable
GitHub Release, prepares an isolated application version and Python environment,
builds the Web interface and then switches the installed launcher. If preparation
fails, the active version stays in place. The same
selected user data directory, encrypted keys, memory, tasks, skills and local
model files remain outside the application versions. Restart a running Web
workspace after updating or rolling back. The first update also moves an
existing editable installation to this managed layout. On Windows, managed
versions are stored under `%LOCALAPPDATA%\liquidbiopsy_agent\app`; close the Web
workspace before updating or uninstalling.

If an older installation does not recognize `liquid-agent update`, download
the current release source and run its operating-system update script once. The
script reads the existing installation receipt and uses its original Python
environment to perform the first upgrade. Installations from before the
required user data directory must first rerun the installer with
`--user-data-dir`.

## Safe uninstall

Close the Web workspace first; its owned Ollama server exits with it. If the
model server was started without Web, stop it with Ctrl+C. Before the first
update, run the uninstaller from the same checkout and Python environment used
for installation. After an update, use `liquid-agent uninstall` so the active
managed version handles removal. Preview the exact paths before removing anything:

```bash
bash scripts/uninstall_liquid_agent_cli.sh --dry-run --purge-private --purge-models
bash scripts/uninstall_liquid_agent_cli.sh --yes --purge-private --purge-models
```

For a managed installation, use:

```bash
liquid-agent uninstall --dry-run --purge-private --purge-models
liquid-agent uninstall --yes --purge-private --purge-models
```

Windows PowerShell:

```powershell
.\scripts\uninstall_liquid_agent_cli.ps1 -DryRun -PurgePrivate -PurgeModels
.\scripts\uninstall_liquid_agent_cli.ps1 -Yes -PurgePrivate -PurgeModels
```

Without the purge flags, uninstall removes the active Python package, any
previous editable package retained for rollback, managed application versions,
registered launch commands and PATH entry. `--purge-private` also removes this
installation's settings, saved credentials, conversations, memory and personal
skills. `--purge-models` removes only a model directory created and marked as
owned by this installer; an existing or unmarked model directory is preserved.
The source checkout, input datasets and shared Python/Node dependencies are
always preserved. If ownership cannot be verified, the uninstaller refuses the
removal rather than guessing.

Browser site storage belongs to each browser profile and is outside the CLI's
safe deletion scope. Before stopping Web, open `?reset-ui=1` on its local URL to
clear that profile's cached conversation list immediately. A fresh installation
also detects a different installation ID and clears the prior list on first open.

## Private storage and task data

Installation requires a dedicated user data directory, separate from the source
checkout. Choose input research-data folders independently within each task.
Your selected parent contains `credentials/`, `memory/`, `skills/`, `tasks/`,
and `models/`. Keep that parent when updating or reinstalling the application.
For an existing installation, select its existing private application folder
when upgrading, then move model files into its `models/` child before local setup.

Private directories include configuration, credentials, memory, personal skills,
and task state. Stored cloud and private-endpoint API keys use authenticated
Fernet encryption; the master key is kept in macOS Keychain, Windows Credential
Manager (local-machine persistence), or Linux Secret Service. There is no plaintext fallback. A locked or
missing key store produces an actionable error. Headless systems may inject
`LIQUID_AGENT_VAULT_KEY` from a secret manager; never commit or log this value.
Environment-supplied provider keys need not be saved to disk.

These directories have no automatic cloud backup/upload mechanism in LIQUID-Agent.
Private settings and global-memory directories cannot be attached as datasets.
Global memory is excluded from cloud prompts by default. Personal guidance is
disclosed only through the existing explicit skill-review boundary. Memory uses
filesystem access controls; it is not encrypted by the application.
They must also stay outside user-configured sync folders and source control.
Cloud conversations still send the user's messages, permitted summaries and
explicit image attachments to the selected provider; see
[Local Data and Privacy](../guides/local-data-privacy.md).

## Optional scientific dependencies and diagnostics

The standard installer includes `web,docs,ml,assay-tables,tools,skills`. Specialized
encoders and file formats may need separate dependencies or external programs.
Do not install all incompatible ML runtime pins into one environment blindly.

```bash
python -m pip install -e ".[blood-io]"
python -m pip install -e ".[report]"
```

`blood-models` is a separately constrained scientific encoder extra. `local` is the
local provisioning extra; `local-llm` is not an extra. Native scientific package
availability varies by OS, especially `pysam`, `pyBigWig` and external Unix tools.
WSL follows the Linux installation path rather than the native Windows path.

<!-- BEGIN CHINESE TRANSLATION -->
---
<a id="chinese"></a>

# 安装（中文）

[Join the Waitlist](https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=as2-rtQxAUuVzoJ0r-hT2crr7c84XABNtm_gHP1xL7VUN0owN1JPSFlaRzlCWVlCME1IMTNKWFlENC4u){ .md-button .md-button--primary target="_blank" rel="noopener noreferrer" }

早鸟体验申请获批后，请下载并解压邀请中提供的软件包，或使用邀请中提供的访问信息克隆代码。
安装后保留代码目录，启动命令依赖该目录。前提是本机已安装 Python 3.11+（建议 3.12）
及 Node.js/npm；安装器**不会连带安装 Python 或 Node**。

## 安装包分发与开源计划 { #packaged-installers-and-open-source }

我们计划提供打包好的安装包，点击安装程序即可安装 LIQUID-Agent。
测试阶段结束后，我们会将本软件开源。开源版本会比安装包版本更及时地获得项目更新。

以下内容是开源版本的源码安装教程。测试阶段请使用向你提供的源码包或代码仓库访问权限。

## 一条命令安装

在项目目录打开终端。如果使用 conda 或 virtualenv，先激活想用的环境。
所有应用 Python 依赖装入该解释器；未激活时用 PATH 中的 Python。
不会自动切换到其他应用环境，也不会绕过系统 Python 的写保护。

macOS（终端或 Finder）：

```bash
./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data"
```

Linux：

```bash
bash install_liquid_agent_linux.sh --user-data-dir "$HOME/Liquid Agent Data"
```

Windows（PowerShell 或命令提示符）：

```powershell
.\install_liquid_agent_windows.cmd -UserDataDir "D:\Liquid Agent Data"
```

Windows 文件仅在本次 PowerShell 进程中绕过执行策略，并调用 Windows 安装入口。
Linux 与 macOS 文件只调用 POSIX 安装入口；Windows 专用的命令和 PATH 处理
仍限定在共用 Python 安装器的 Windows 分支。
在线与本地模型安装都必须明确选择独立于项目源码的用户信息目录。在终端运行时
若未传参数，同一个安装器会询问绝对路径。安装器在所选目录下分别创建 `credentials/`、
`memory/`、`skills/`、`tasks/`、`models/`，更新应用时继续使用此目录。
显式解释器可在 macOS/Linux 设置 `LIQUID_AGENT_PYTHON=/absolute/path/to/python`，
PowerShell 使用 `-Python C:\path\to\python.exe`；高级 conda 用户可用
`LIQUID_AGENT_ENV` 指定已经存在的命名环境。

安装会配置 Python 依赖、构建 Web 与双语文档、创建私有用户目录并注册启动命令。
安装后打开新终端。命令保存安装解释器，conda 会自动进入记录的环境；
环境被删除或改名后需重新安装命令。

```bash
liquid-agent       # Web workspace
liquid-agent cli   # Terminal interface
liq                # Short alias for Web
liquid-agent wiki  # Project homepage and documentation
```

`liquid-agent web` 和 `liquid-agent client` 也打开 `/#/agent`。介绍页 **Try it**
直接打开本安装指南，不检查或启动本地工作台。若要进入已安装的工作台，请使用启动器
在终端打印的地址。自定义端口使用 `liquid-agent wiki --port YOUR_PORT` 或服务自身 URL。

## 可选本地模型

不加 `local` 时只安装在线模型使用版，不显示本地模型菜单、不下载权重。
本地安装使用相同的用户信息目录，模型放在其中的 `models/` 子目录：

```bash
bash install_liquid_agent_linux.sh --user-data-dir "$HOME/Liquid Agent Data" local
```

```powershell
.\install_liquid_agent_windows.cmd local -UserDataDir "D:\Liquid Agent Data"
```

macOS 对应命令为 `./install_liquid_agent.command --user-data-dir "$HOME/Liquid Agent Data" local`。

遗漏用户信息目录或使用相对路径会在安装依赖前报错，含空格须加引号。
此目录存储应用个人数据，与工作区内选择的研究数据盘分开。

CLI 菜单显示审核过的多模态 Ollama 候选、下载量及工作内存估计。输入编号后检查
系统、可用内存／显存和磁盘，保留科研工作的余量。通过后下载视觉模型及编码器，
按计划配置上下文并运行基本工具调用探测。请在实际使用的设备上评估多图、连续
对话、多步工具及长任务的表现；加载或探测失败表示该配置尚不可用。

8 GiB 显存设备的默认 32K 上下文 Qwen3.5 4B 可能超过预留显存预算。可将
`[{"model":"qwen3.5:4b","context_tokens":24576}]` 保存为 JSON 模型列表，再运行
`install_liquid_agent_windows.cmd local -UserDataDir "D:\Liquid Agent Data" -ModelsList "C:\path\to\models.json" -Yes`。
这会缩短实际安装的上下文并重新估算容量，但仍须以目标电脑上的加载和工具探测为准。
如果完整 Web 对话和科学工具超出上下文预算，请减少其他内存占用或选择更大的上下文。

纯文本 Qwen3 GGUF 选项已移除。候选为 Qwen3.5 4B/9B、Qwen3.8 27B 和 Muse
Glimmer 30B，依据官方 model card 保留，并受容量筛查约束。
既有配置和密钥会保留。[本地语言模型](../guides/local-models.md)说明完整设置方式。
安装探测不代表已经确认科研准确性或长任务可靠性。

本地安装保留云端密钥和固定型号，Web 模型菜单或 CLI 随时切换。
使用 `liquid-agent local-models serve` 启动托管服务，再选择对应配置。
关闭最后一个 Web 页面时，Liquid Agent 会通知本次托管的 Ollama 服务退出；
独立安装或用户自行启动的 Ollama 不会被停止。
高级自动化可使用 `--user-data-dir PATH --with-local-models --model MODEL --yes`
（PowerShell：`-UserDataDir PATH -WithLocalModels -Model MODEL -Yes`）。
旧 `--models-dir` 参数只有等于 `PATH/models` 时才有效。
安装器的 `--dry-run` / `-DryRun` 只跳过模型部署，仍安装依赖与命令。
仅检查模型计划：

```bash
python -m liquidbiopsy_agent.local_setup setup --models-dir /absolute/path/models --dry-run
```

## macOS、Linux 与 Windows 更新

本地 Web 工作台打开时会检查 GitHub 上较新的稳定版。发现新版本后显示可关闭的
提示；关闭后继续使用旧版，也可随时点击工作台中的 **Check for updates**。
提示仅提供版本说明和终端命令，不会自动安装。

```bash
liquid-agent update --check
liquid-agent update
liquid-agent update --rollback
```

在原始仓库目录中，macOS 可使用 `./update_liquid_agent.command`，Linux 可使用
`bash update_liquid_agent_linux.sh`，Windows 可运行
`.\update_liquid_agent_windows.cmd`。更新器先准备隔离的新程序版本与 Python 环境，
构建 Web 界面，然后切换启动命令。准备失败时继续使用当前版本。
原先选定的用户信息目录、加密密钥、记忆、任务、个人技能与本地模型保持原位。
更新或回退后请重新启动正在运行的 Web 工作台。首次更新也会把已有的可编辑安装
转为受管理的版本目录。Windows 的托管版本位于
`%LOCALAPPDATA%\liquidbiopsy_agent\app`；更新或卸载前请关闭 Web 工作台。

若旧安装尚不识别 `liquid-agent update`，请下载当前发布版的源码，运行其中的
对应系统的更新脚本一次。脚本读取原安装收据，并沿用原 Python 环境完成首次升级。
早于强制指定用户信息目录的旧安装，须先以 `--user-data-dir` 重新运行安装器。

## 安全卸载

先关闭 Web 工作台；其托管的 Ollama 会一起退出。若只启动过模型服务而未启动 Web，
先按 Ctrl+C 停止。首次更新前，从安装时的同一代码目录、同一 Python 环境运行
卸载程序；更新后使用 `liquid-agent uninstall`，由当前受管理版本完成卸载。
先预览精确删除路径：

```bash
bash scripts/uninstall_liquid_agent_cli.sh --dry-run --purge-private --purge-models
bash scripts/uninstall_liquid_agent_cli.sh --yes --purge-private --purge-models
```

受管理的安装可改用：

```bash
liquid-agent uninstall --dry-run --purge-private --purge-models
liquid-agent uninstall --yes --purge-private --purge-models
```

Windows PowerShell：

```powershell
.\scripts\uninstall_liquid_agent_cli.ps1 -DryRun -PurgePrivate -PurgeModels
.\scripts\uninstall_liquid_agent_cli.ps1 -Yes -PurgePrivate -PurgeModels
```

不加清理选项时，只移除本代码目录安装的 Python 包、启动命令和 PATH 登记。
更新后保留用于回退的原可编辑 Python 包及受管理的程序版本也会一并移除。
`--purge-private` 还会清除本次安装的设置、已保存凭据、对话、记忆和个人技能。
`--purge-models` 仅清除由安装器创建并标记归属的模型目录；既有或未标记的
模型目录保留。源码目录、输入数据和共用的 Python/Node 依赖始终保留。
无法确认归属时，卸载器会拒绝删除，不会猜测。

浏览器站点存储属于各自的浏览器配置，命令行卸载器不会跨浏览器清理。若要立即清除，
在关闭 Web 前打开其本地地址并加上 `?reset-ui=1`。全新安装首次打开时也会识别
不同的安装标识，清除前一次安装的缓存会话列表。

## 私有存储与任务数据

安装必须指定独立于源码的用户信息目录。每个任务再独立选择研究数据输入目录。
所选父目录下分别存放 `credentials/`、`memory/`、`skills/`、`tasks/`、
`models/`。更新或重新安装应用时继续选择同一个父目录；已有安装可选择原私有
应用目录，并在本地模型部署前把既有模型文件移至其中的 `models/`。

私有目录含配置、凭据、记忆、个人技能、任务状态。云端与私有端点 API key 使用
Fernet 认证加密，主密钥在 macOS 钥匙串、Windows 凭据管理器（仅本机持久化）或 Linux
Secret Service。凭据库缺失／锁定时明确报错，不回退明文。无桌面系统可由秘密管理器注入
`LIQUID_AGENT_VAULT_KEY`，不要提交或记录。环境变量提供的服务商密钥无需保存磁盘。

软件没有这些目录的自动云备份／上传机制，也不允许把私有配置／全局记忆目录当作数据源。
云端提示默认不附加全局记忆；个人指导沿用显式技能审阅披露边界。记忆依靠文件系统权限，
不是应用级加密。目录应避开用户配置的同步盘和源码管理。
使用云端服务时，当前用户消息、允许的汇总、明确上传的图像仍会发送到所选提供商，
参见[本地数据与隐私](../guides/local-data-privacy.md)。

## 可选科学依赖与诊断

标准安装含 `web,docs,ml,assay-tables,tools,skills`。
特殊编码器、格式和外部工具另装，不要把不兼容的 ML 版本约束盲目装到一个环境。

```bash
python -m pip install -e ".[blood-io]"
python -m pip install -e ".[report]"
```

`blood-models` 是有独立版本约束的科学编码器 extra；`local` 才是本地模型部署 extra，
没有 `local-llm`。原生包供应因系统而异，尤其是 `pysam`、`pyBigWig` 和外部 Unix 工具。
WSL 使用 Linux 安装路径，不等同于原生 Windows 安装。
