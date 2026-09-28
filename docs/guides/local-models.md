<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# Local Language Models

OpenAI remains the default. Local inference is an explicit option for users who
want to run a language model on their own computer or private LAN server.
The same scientific tools, LangGraph execution, skills, task memory, linked tasks,
image provenance and review controls remain in use. Model reasoning quality and
scientific reliability still depends on the selected model. Text-only models are no longer eligible.

## One preferred engine, one official compatibility path

- **Ollama** is the preferred managed engine. Use its local model tags or supported
  `hf.co/...` GGUF references. It is not limited to a company or country of origin.
- An explicit Hugging Face `organisation/model` selection with a reviewed Ollama
  mapping uses that counterpart. Otherwise, setup inspects the official model
  card/configuration, pins the HF commit and routes it to **Hugging Face's official
  Transformers server**. This optional runtime is installed only when needed,
  into the user-selected Python environment; review dependency compatibility before installation.
- An existing private OpenAI-compatible Chat Completions server can also be
  registered. This covers model-card recipes that require vLLM, SGLang or another
  specialised runtime, without installing every framework into LIQUID-Agent.

Routing is resolved in the installation plan and saved in each profile. A network,
quota, authentication, memory or generation failure does **not** trigger another
model, engine or cloud provider. Arbitrary Ollama tags cannot be reliably mapped
back to an HF checkpoint: specify its official HF repository to request that path.
To use the original HF weights even when an Ollama counterpart is known, use a
model-list entry with `"runtime": "transformers"`.

There is no promise that every HF repository will run. Models need a compatible
architecture, instruct/chat template, adequate context, multi-image input, multi-turn conversation and working function calls.
Custom repository code is not executed automatically. Specialised quantization
kernels and model-card-specific servers require their own reviewed setup. A model
may fit in memory and still perform poorly on scientific planning.

## Installation and storage

Local models can also be added after either installer mode. In the Web workspace,
open the model menu and choose **Manage local models**. The reviewed library is
hardware-screened before download and uses the installation's private user-data
directory automatically; model files go to its `models/` child. No research-data
folder is reused for weights. Eligible models have an install control; unsupported
models remain visible but disabled with the capacity reason.

Web downloads are independent, so several eligible models can download together.
Pause closes that model's active pull stream while its isolated staging service
keeps the verified partial files; Continue resumes against the same service.
Abandon stops that staging service, removes only that partial model and
returns its row to Not installed. Closing the library does not stop a download:
the compact model menu keeps its progress and controls. Completion performs a
local manifest/capability check without loading the model for scientific inference,
then shows a green completion mark. Selecting the model clears that mark and starts
the installation-owned Ollama service when needed. Cloud keys and the previous
cloud selection are preserved throughout.

The base installer has an optional local-model choice. Select an absolute user
data directory outside the project source; weights go in its `models/` child. On macOS/Linux:

```bash
./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data" --with-local-models
```

On Windows, use an activated Python 3.12 and Node.js environment:

```powershell
.\scripts\install_liquid_agent_cli.ps1 -UserDataDir "D:\Liquid Agent Data" -WithLocalModels
```

For an existing installation, first review a download-free capacity plan:

```bash
liquid-agent local-models hardware
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --dry-run
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --install-runtime
```

The second command does not create model directories or change provider defaults.
HF selections may fetch metadata/model cards, but not weights, during planning.
Installation prompts for confirmation after displaying eligible and skipped models.
Use `--yes` for an already-reviewed unattended installation. Gated HF downloads
require the appropriate license/access and an `HF_TOKEN` in the installing process;
it is not stored in the local inference profile.

Setup conservatively reserves RAM/VRAM for the OS and analysis. The reviewed
initial recommendations at 32K context are estimates: 16GB Apple Silicon →
Qwen3.5 4B, 32GB Apple Silicon → Qwen3.5 9B, and a sufficiently free 32GB NVIDIA
GPU → Qwen3.8 27B. These are capacity candidates, **not completed hardware
benchmarks or scientific-quality endorsements**. Active GPU use changes selection.
Large MoE models need their full weights available; active parameter count alone
is not a memory estimate. Longer context consumes additional memory.

Managed Ollama requires macOS 14+ or Windows 10 22H2+ on the supported
architectures (Linux is also supported). Its release is pinned with per-platform SHA256 checks. Setup downloads
eligible models, binds the planned context to an owned `liquid-…:managed` alias,
and runs the existing small synthetic tool/result round trip. It records successes/failures
in `liquid-local-install-report.json` in the model directory. Failed probes do not
activate a profile. Partial/cached weights remain for diagnosis or retry; reports
and existing source datasets are never removed. Existing profile IDs and default
model pins are not overwritten.

## Meta Muse Glimmer 30B

Reviewed 23 September 2026: the official repository is
[meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B).
Meta's [Ollama recipe](https://github.com/meta-models/meta-oss-cookbook/blob/main/inference-server/ollama.md)
supports the existing local Chat Completions interface. An explicit selection of
that HF repository now resolves to **`muse-glimmer:30b-q4_K_M`**, the text-and-image
quantization in [Ollama's model library](https://ollama.com/library/muse-glimmer:30b).
This adds an optional model; it does not change automatic recommendations, the
active provider, saved keys or an existing model profile.

From a repository checkout, use the supplied `configs/local-models-muse.json`
(profile ID `muse`), replacing the model storage path:

```bash
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --models-list configs/local-models-muse.json --dry-run
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --models-list configs/local-models-muse.json --install-runtime
liquid-agent local-models serve
```

Keep the server terminal open. In another terminal, test and explicitly select it:

```bash
liquid-agent local-models probe muse
liquid-agent local-models use muse
liquid-agent
```

Alternatively pass `--model meta-models/Muse-Glimmer-30B` or the exact Ollama tag
instead of `--models-list`; that route generates a profile ID, shown in the plan.
An existing installation can also register a manually served model through
**Manage local models**. A manually registered endpoint still needs the correct
runtime/model/context configuration and its own tool probe.

| Setting | Managed Muse profile |
| --- | --- |
| Model files | Approximately 17 GiB, including the vision projector |
| Capacity estimate | 22 GiB working memory at 64K context; includes cache/runtime headroom, not a measured peak |
| Context / output budget | 65,536 / 8,192 tokens; context is bound to the owned Ollama alias |
| Sampling / reasoning | Temperature 1.0, top-p 0.95, high reasoning; top-k 64 inherited from the official Ollama model |
| Request timeout | 900 seconds |
| Runtime | Stable Ollama 0.32.7+; checked before downloading weights. The bundled release may be newer. |

The 64K default leaves room for LIQUID-Agent's full scientific tool catalog,
workspace context, image attachments and the reasoning/output reserve. The capacity
estimate is anchored at 64K (`estimate_context_tokens`); larger contexts increase
the screening estimate instead of treating the published maximum as free memory.

A 16GB Mac is skipped before download. A 32GB Apple Silicon machine or a 32GB
NVIDIA GPU with sufficient free memory is an **estimated candidate**, not a
guaranteed fit. Close other memory-heavy work and verify peak use with real images
and scientific tools. Longer contexts undergo additional memory screening; a
published 128K limit does not mean 128K fits these machines. The main HF BF16
checkpoint alone is about 55.5 GiB. `"runtime": "transformers"` or an explicit HF
`revision` keeps that original checkpoint and its capacity checks instead of
silently selecting the quantization. The 3B assistant/drafter is not a standalone
replacement. MLX and DFlash variants are not automatically selected by this recipe.

The managed runtime still uses an internal `liquid-muse-glimmer-…:managed` alias,
but Web/CLI menus show the human name **Muse Glimmer 30B**. The alias binds the
planned context and remains visible only as a technical server identifier. Text,
tool calls, image attachments, task history and scientific safeguards
use the shared local adapter. A successful installation probe establishes a basic
tool/result round trip only. Confirm image interpretation, scientific accuracy and
long-task reliability on your own hardware before relying on the model.

## Multiple models and automatic routing

Pass a JSON list using `--models-list /path/models.json`:

```json
[
  "qwen3.5:4b",
  "qwen3.8:27b",
  {"id": "hf-qwen", "model": "Qwen/Qwen3.5-4B", "runtime": "transformers"},
  {"id": "custom-gguf", "model": "hf.co/OWNER/REPOSITORY:Q4_K_M",
   "weights_gib": 5, "working_gib": 14, "estimate_context_tokens": 65536,
   "context_tokens": 65536, "vision": true}
]
```

Replace the illustrative `OWNER/REPOSITORY` with a reviewed multimodal GGUF bundle,
including its vision projector; a text-only GGUF is not supported.
For unknown Ollama tags, provide conservative `weights_gib` and `working_gib`
(including weights, context cache and runtime overhead). Unknown sizes are skipped
instead of guessed. HF safetensors file sizes can supply an initial estimate;
quantized/custom checkpoints may still need explicit estimates and separate
runtime dependencies. Oversized models are explained and skipped before download.
Disk requirements accumulate across installed models; memory is assessed per model.

Start the selected engine in a terminal:

```bash
liquid-agent local-models serve
# Only for profiles routed to the optional HF engine:
liquid-agent local-models serve --runtime transformers
```

Keep the appropriate terminal open. Ctrl+C stops the owned server; closing the
last Web workspace page also stops a Liquid Agent-managed Ollama server. An
independently started Ollama is untouched. Managed ports
are 11435 for Ollama and 11436 for HF by default. The HF wrapper serializes generations and releases the previous model on a
model switch; its official generation/tool parser is unchanged. Do not run both
engines with loaded models on a memory-constrained machine. Setup never takes over an unknown process
already using those ports. A downloaded model is not a running model server.

## Connect, install, test and select

In Web, open the model menu → **Manage local models**. Each reviewed model has
one compact row and an install button. Liquid Agent downloads the runtime and
model into the personal storage folder selected at installation, verifies the
model manifest, and configures the endpoint, context and display name internally.
There is no manual configuration form. Click an installed model to use it.

The preparation phase has a moving indicator; model transfers have a thin,
theme-coloured progress line. Pause keeps the partial files; Continue resumes;
Abandon removes that model's partial files. Closing the library leaves the model
menu open with the same progress and controls. The green completion check clears
from both places after successful selection. Downloads continue across page
refreshes; restarting the service preserves them in the paused state.

Download eligibility checks total device capacity and available disk space;
transient free RAM does not disable an otherwise compatible download. Models
that exceed the device capacity remain unavailable with an explanation when
clicked. Installing does not load a model or certify its inference quality.

Existing private-server profiles can still be configured through the CLI or
local API. They are kept separate from this automatic download library, and
existing profiles and conversation selections remain supported.

Saved local profiles appear by their display name in the same model menu. Managed
Qwen and Muse profiles receive names such as **Qwen 3.5 4B** automatically; their
hashed server aliases are not used as UI titles. Older reviewed managed profiles
are recognized by profile ID, while custom profiles can set or edit a display name.
Choosing one is explicit; setup itself leaves the cloud default untouched. CLI equivalents:

```bash
liquid-agent local-models list
liquid-agent local-models add --id lab --display-name "Lab multimodal model" --model my-model --runtime ollama --base-url http://127.0.0.1:11434/v1 --context-tokens 65536 --vision
liquid-agent local-models probe lab
liquid-agent local-models use lab
liquid-agent cli
```

Inside the CLI, `/llm use local lab` selects the profile; `/llm save` persists it.
`local-models remove lab` removes only the profile, not model files or conversations.
An active task with a removed profile reports an error; it never falls back to GPT.
The optional local bearer token can be passed via `--api-key-env LOCAL_MODEL_TOKEN`;
use a distinct variable, never a cloud API key. Advanced sampling/template options
can be supplied as a JSON file with `--request-options`.

Local adapters use streaming Chat Completions, validated tools, cancellation,
steering and locally persisted history. Complete history groups are summarized
with the **same local model** before context exhaustion. Current prompts, images
or tool catalogs that cannot fit fail explicitly; the adapter does not truncate
scientific evidence silently. Interrupted tool receipts direct the next turn to
check saved task evidence before retrying work. The full tool catalog needs more
context than a small standalone chat. The Qwen profiles retain their existing 32K
default; Muse uses 64K. When using several images with the complete tool catalog,
monitor memory and adjust context/output budgets within the available capacity.
Model-card maximums are not automatically allocated.

## Data safety and deployment requirements

Profiles live in `local_models.json` under the normal user configuration directory
(`LIQUIDBIOPSY_CONFIG_DIR` can redirect it). POSIX writes use owner-only files;
Windows deployments must verify the directory's user ACL. API keys are encrypted
with an OS credential-store master key; unavailable stores fail without plaintext
fallback. No keys belong in Git. Advanced Transformers dependencies install into
the Python environment chosen by the user; they do not create another venv.

Managed Ollama uses `OLLAMA_NO_CLOUD=1`, loopback binding, an explicit model storage
path and one loaded model. Remote/cloud forwarding models are rejected. The owned
HF server uses `HF_HUB_OFFLINE=1`, `TRANSFORMERS_OFFLINE=1`, telemetry-disabled
settings and no repository custom code. Assets are downloaded during installation,
not fetched on behalf of a scientific inference request. Local request clients
ignore proxy environment variables and reject public endpoints and redirects.
Connections use the checked private IP directly while retaining the original
HTTP Host and TLS server name, closing the gap between DNS validation and connection.
Changing or revoking a profile's token interrupts its active turn. A damaged local
registry produces a repair error in the local manager without disabling cloud menus.
A private endpoint can still be a misconfigured forwarding server; configure and
verify the server you operate.

The local Web API rejects foreign browser origins and rebound Host names before
running an operation. The public portal does not probe the local API; **Try it**
opens the installation documentation directly. The managed HF daemon rejects direct
browser requests. These checks are not user authentication: keep the application
on loopback; a private LAN inference server needs its own access controls.

These settings are not a proof that the **entire application** is offline.
Literature retrieval, dependency/model downloads and explicitly networked tools
have separate network needs. For sensitive data, predownload assets, restrict
OS/container outbound access, and observe network traffic on the target device.
Offline mode in a library is not a firewall.

References:
[Ollama privacy/offline FAQ](https://docs.ollama.com/faq),
[Ollama compatibility](https://docs.ollama.com/api/openai-compatibility),
[Ollama imports](https://docs.ollama.com/import),
[HF official serving](https://huggingface.co/docs/transformers/serve-cli/serving),
[Qwen model card](https://huggingface.co/Qwen/Qwen3.5-4B),
[DeepSeek local deployment guidance](https://huggingface.co/deepseek-ai/DeepSeek-V3).

<!-- BEGIN CHINESE TRANSLATION -->
---
<a id="chinese"></a>

# 本地语言模型

OpenAI 仍是默认后端；本地推理需要用户明确选择。科学工具、LangGraph、skills、
任务记忆、多任务链接和审阅机制继续共用。内置优先使用 Ollama；显式指定的
Hugging Face 仓库若没有已审核的 Ollama 对应项，则读取官方模型卡及配置，固定
模型提交版本，使用 Hugging Face 官方 Transformers 本地服务。该兼容运行时
按需安装在用户选定的 Python 环境；安装前须检查依赖兼容性。

并非所有 Hugging Face 模型都可运行。架构、量化内核、工具调用、上下文和硬件
都必须兼容；不会自动执行仓库自定义代码。官方要求 vLLM/SGLang 等特殊方案的
模型，可按其模型卡部署，再通过私有兼容接口接入。运行失败不会盲目更换模型或
转用云端。Ollama 标签不能可靠反推 HF 仓库，需要用户给出官方仓库 ID。

## 安装与选择

无论最初安装时选择外部 API 还是本地模型，之后都可以在 Web 工作台的模型菜单中
打开**管理本地模型**。经过审核的模型库会先按当前硬件、可用内存/显存及磁盘空间
筛查；不适合本机的模型仍会显示，但保持灰色并说明原因。权重自动存入安装时指定的
用户信息总目录下的 `models/` 子目录，不会占用或混入科研数据目录。

多个符合条件的模型可以同时下载。暂停会关闭该模型当前的拉取流，同时保留独立暂存
服务和已经校验的分片；继续会通过同一暂存服务在原分片上续传；放弃会停止暂存服务、
只删除该模型的未完成文件，并恢复为
未安装状态。关闭管理对话框不会停止下载，模型小菜单继续显示适配后的进度和控制。
下载结束后，系统在本机做不加载科研推理的清单/能力检查，并显示绿色完成标记；用户
点击选择该模型后，标记在两个界面同步消失，Web 会按需启动安装所拥有的 Ollama 服务。
原有云端 key、云端模型配置和对话不会被覆盖。

macOS/Linux 安装脚本支持可选本地模型安装，必须指定源码之外的绝对用户信息目录，模型存于其 `models/` 子目录：

```bash
./scripts/install_liquid_agent_cli.sh --user-data-dir "$HOME/Liquid Agent Data" --with-local-models
```

Windows 在已激活的 Python 3.12 / Node.js 环境中运行：

```powershell
.\scripts\install_liquid_agent_cli.ps1 -UserDataDir "D:\Liquid Agent Data" -WithLocalModels
```

已安装用户可以先查看不下载权重的硬件计划，再执行安装：

```bash
liquid-agent local-models hardware
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --dry-run
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --install-runtime
liquid-agent local-models serve
```

HF 模型使用 `liquid-agent local-models serve --runtime transformers` 启动。
保持相应终端开启；Ctrl+C 停止服务。关闭最后一个 Web 工作台页面也会停止
Liquid Agent 托管的 Ollama；独立启动的 Ollama 不受影响。默认端口分别是 11435 和 11436。
安装完成不会改变原先云端模型和 key。Web 管理窗口只显示紧凑的模型列表；点击下载后，
系统自动完成存放、检查和配置，用户不需要填写模型地址、端口或上下文参数。
准备阶段显示动态细线，下载时显示主题色进度；暂停保留分片，继续续传，放弃删除分片。
点击已安装模型即可使用；绿色圆圈勾号会在管理窗口和小菜单中一起消失。
关闭管理窗口会保留模型小菜单。下载资格依据设备总容量和磁盘空间，其他程序暂时占用
内存不会禁用 4B 下载按钮；真正超出容量的模型会说明原因。
自定义私有服务器仍可通过 CLI 或本地 API 配置，既有配置不会被删除。CLI 可使用
`liquid-agent local-models use <profile-id>` 或 `/llm use local <profile-id>`。

使用 `--models-list /path/models.json` 指定多个模型，格式参见上方英文示例。
没有已审核 Ollama 映射的 HF 仓库自动走官方 Transformers 路径；如希望已映射
模型也用原始 HF 权重，设置 `"runtime": "transformers"`。
未知 Ollama 模型需要提供 `weights_gib` 和 `working_gib`；没有足够信息的模型
会明确跳过，不猜测、不先下载。安装报告保存在模型目录的
`liquid-local-install-report.json`。失败下载或探测留下的缓存不会擅自删除。

Qwen 使用 32K 配置和以下容量估计：16GB Apple Silicon → Qwen3.5 4B，32GB
Apple Silicon → Qwen3.5 9B，空闲显存足够的 32GB NVIDIA → Qwen3.8 27B。
Muse 使用单独的 64K 配置。这些只是容量估计；同时使用完整工具目录和多张图片时，
应观察内存占用，并在设备容量范围内调整上下文及输出预算。安装探测只确认基本工具
往返，不能替代对图片理解、科学准确性和长任务可靠性的实际评估。

## Meta Muse Glimmer 30B

官方仓库为
[meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B)。
按 [Meta 的 Ollama 部署说明](https://github.com/meta-models/meta-oss-cookbook/blob/main/inference-server/ollama.md)，
沿用现有接口即可支持。显式选择这个仓库时，安装计划会选择
`muse-glimmer:30b-q4_K_M` 文本/图像量化版；不会更改默认推荐、当前模型或已有 key。

仓库提供 `configs/local-models-muse.json`，配置名称为 `muse`。在仓库目录运行，
把存储位置换成目标设备上的绝对路径：

```bash
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --models-list configs/local-models-muse.json --dry-run
liquid-agent local-models setup --models-dir "$HOME/Liquid Agent Data/models" --models-list configs/local-models-muse.json --install-runtime
liquid-agent local-models serve
```

保留服务终端，在另一终端运行 `liquid-agent local-models probe muse`，通过后用
`liquid-agent local-models use muse` 明确选用，再运行 `liquid-agent` 打开 Web。
也可以把 `--models-list ...` 换成 `--model meta-models/Muse-Glimmer-30B`，
此时配置名称由安装计划生成。底层仍以 `liquid-muse-glimmer-…:managed` 作为绑定上下文的
服务别名，但 Web/CLI 菜单显示 **Muse Glimmer 30B**。Qwen 托管配置同样显示
**Qwen 3.5 4B** 等易读名称；自定义配置可在管理界面填写或修改显示名称。

量化权重连同图像编码器约 17 GiB；64K 上下文的工作内存估计为 22 GiB。
16GB Mac 会在下载前跳过；32GB Apple Silicon 或空闲显存足够的 32GB NVIDIA
设备是估算的容量候选。图片、长上下文、其他科学计算仍可能使内存不足。
原始 HF BF16 权重约 55.5 GiB；显式设置 `runtime: transformers` 或 HF `revision`
会保留原始检查点并单独检查容量，不会偷偷改成量化版。

安装前要求稳定版 Ollama 0.32.7 或更新。默认 65,536 上下文、8,192 输出预算、
900 秒超时，temperature 1.0、top-p 0.95、high reasoning；top-k 64 继承自
官方 Ollama 模型。64K 为完整科学工具目录、工作区上下文、多图和推理输出保留空间；
容量估算以该上下文为基准，更长上下文会进一步提高内存要求。
不会自动选择 MLX/DFlash 版本，也不会把 3B drafter 当作完整模型。
模型支持文图输入和工具调用，但安装探测不代表已经确认真实模型的读图、
科学准确性或长任务能力。正式使用前请在自己的目标机器上评估这些能力。

## 隐私与运行边界

本地配置单独保存在用户配置目录的 `local_models.json`，不进入项目源码。API key 使用系统凭据库
主密钥认证加密，凭据库不可用不回退明文。高级 Transformers 依赖装入用户选定的 Python，
不另建 venv；需与所选环境已有科学依赖核对版本。
托管 Ollama 关闭云端模式，HF 服务使用离线和禁用遥测设置；本地 HTTP 请求不
继承代理、不跳转到公网，也不继承 OpenAI/Gemini 的 key。私有服务器仍需由
部署者确认没有转发到外部服务。整个软件的文献检索等联网工具需要另行管理。
连接直接使用已经检查过的私网 IP，保留原 HTTP Host 与 TLS 服务名，避免检查后
再次解析域名造成绕过。更新或撤销本地认证会中止旧连接；本地配置损坏会明确
提示修复，不会连带关闭 GPT/Gemini 的选择入口。
Web API 在执行前拒绝外站来源和伪造域名。公开门户不会探测本地 API；**Try it**
直接打开安装文档。托管 HF 服务拒绝网页直接调用。这些保护不代替用户认证，请保持应用绑定本机；
局域网推理服务器仍需单独配置访问控制。
如需要严格离线，应先下载依赖和模型，再限制系统出站网络并观察实际流量。
仅凭框架的离线设置不能声称绝对不会上传。
