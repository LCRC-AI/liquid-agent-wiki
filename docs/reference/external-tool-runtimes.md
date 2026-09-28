<a id="english"></a>

[English](#english) | [简体中文](#chinese)

# External Tool Runtimes

Liquid Agent can now manage a dedicated external-tool layer for liquid-biopsy methods that are not part of the main Python kernel. This layer is intentionally separate from the default environment: Python packages with strict pins, R/Bioconductor packages, Snakemake workflows, source-only research code, and system binaries are installed or checked in isolated runtimes where possible.

Use this page when a method is not just a recommendation and you want to know whether Liquid Agent can actually call its runtime.

## CLI

Show all registered external runtimes:

```bash
liquid-agent tools status
```

Show one runtime as JSON:

```bash
liquid-agent tools status --tool purecn --json
```

One-command setup for common stable runtimes:

```bash
liquid-agent tools bootstrap
liquid-agent tools bootstrap --execute
```

Prepare every auto-installable runtime:

```bash
liquid-agent tools bootstrap --profile all
liquid-agent tools bootstrap --profile all --execute
```

Dry-run an installer:

```bash
liquid-agent tools install purecn
```

Execute the installer:

```bash
liquid-agent tools install purecn --execute
```

Run a smoke test:

```bash
liquid-agent tools smoke purecn
```

Run a command through the wrapper:

```bash
liquid-agent tools run cnvkit -- cnvkit.py --help
liquid-agent tools run purecn -- Rscript -e "library(PureCN); packageVersion('PureCN')"
liquid-agent tools run dorado_modkit -- modkit --version
```

Write a status report:

```bash
liquid-agent tools status --output-dir <output_dir>
```

This writes:

- `liquid_biopsy_external_tool_status.json`
- `liquid_biopsy_external_tool_status.md`

## Status Meaning

| Field | Meaning |
| --- | --- |
| `installed` | The runtime, source checkout, executable, Python module, or R package is locally callable through Liquid Agent. |
| `ready` | The runtime is installed and all data-specific resources are configured, including model checkpoints, reference panels, manifests, or real input files. |
| `auto_installable` | Liquid Agent has an automated install/preparation route for the current runtime class. |
| `reimplementation_candidate` | The original tool is valuable but not cleanly installable; a small internal proxy or modern reimplementation should be preferred over asking ordinary users to debug legacy dependencies. |
| `compatibility_proxy_*` | A Liquid Agent internal implementation exists for the practical subset that is safe to reproduce in the main Python runtime. |

A runtime can be `installed=True` and `ready=False`. That is normal. For example, PureCN can be installed and smoke-tested, but a real analysis still needs interval coverage tables and normal-database resources.

Users do not need to activate the isolated conda environments manually. Liquid Agent runs external commands through wrappers such as `conda run -n liquid_tool_purecn ...` from the main agent process.

## Registered Runtime Classes

| Class | Examples | How Liquid Agent handles it |
| --- | --- | --- |
| Isolated Python env | MethylBERT, CNVkit, FinaleToolkit, MetDecode, BayesCNV, CpGPT, MethylGPT | Creates a dedicated conda environment and checks Python modules or CLI commands. |
| Source checkout | cfDecon, CelFEER, UXM, MethAtlas, cfNOMe, cfDNAFE, EMIT, DeepFRAG | Clones source code under `~/.liquidbiopsy_agent/external_tools/src` and runs registered smoke commands when safe. |
| Snakemake workflow | cfDNA UniFlow | Clones the workflow and installs Snakemake in an isolated env; real runs need workflow config and references. |
| Isolated R/Bioconductor env | PureCN, FACETS core | Creates a dedicated conda R environment and validates `Rscript` plus R package loading. |
| System binary wrapper | modkit route for nanopore methylation | Installs/calls modkit where available; Dorado basecalling remains a user-provided binary/model resource. |
| Reimplementation candidate | CopywriteR on macOS arm64 | Keeps the method visible, records why the legacy install fails, and routes users toward an internal CNV proxy or a maintained modern CNV method. |

## Current High-Value Tools

| Signal | Runtime/tool | Current project treatment |
| --- | --- | --- |
| Fragmentomics | FinaleToolkit | Isolated Python CLI/runtime. |
| Fragmentomics | cfDNAFE | Source checkout with callable source CLI where compatible. |
| Fragmentomics | cfDNA UniFlow | Snakemake workflow wrapper; real runs need config/reference resources. |
| Fragmentomics | EMIT | Source/model checkout; real runs need EMIT-format end-motif data. |
| Fragmentomics | DeepFRAG | Source checkout; real supervised use needs labels, model resources, and validation design. |
| Methylation | MethylBERT | Isolated Python runtime; real use needs trained checkpoints and read-level methylation inputs. |
| Methylation | cfDecon, CelFEER, UXM, MethAtlas, cfNOMe | Source checkouts; real runs need atlas/marker/reference resources. |
| Methylation | MetDecode | Isolated Python/source runtime; real runs need marker-region methylated/total CpG counts and reference panel. |
| Methylation | CpGPT, MethylGPT | Isolated Python/source runtimes; real runs need compatible checkpoints and matrices. |
| Methylation | Dorado + modkit | modkit can be installed/called; Dorado binary/model and nanopore inputs remain explicit requirements. |
| CNV | CNVkit | Isolated Python CLI/runtime. |
| CNV | PureCN | Isolated R/Bioconductor runtime; real runs need coverage/normal/VCF resources. |
| CNV | FACETS core | Isolated R runtime for core FACETS; full allele-specific workflow needs SNP pileups or platform-specific helpers. |
| CNV | BayesCNV | Isolated Python/source runtime for JAX/numpyro components. |
| CNV | CopywriteR | Legacy install is not reliable on macOS arm64; tracked as a reimplementation candidate with an internal CopywriteR-like CNV proxy. |

## Internal Compatibility Proxies

Some useful research tools are tied to old Python, old R/Bioconductor, or platform-specific runtime assumptions. When the upstream implementation is small enough, open-source, and algorithmically clear, Liquid Agent can expose a modern internal proxy instead of asking users to repair legacy environments.

Current proxy:

```bash
liquid-agent copywriter-proxy \
  --input <interval_or_bin_dir> \
  --output-dir <output_dir> \
  --exclude-regions <targets_or_peaks.bed>
```

This proxy is intended for first-pass CopywriteR-like off-target/bin-count CNV screening. It performs interval binning, optional target/peak exclusion, depth normalisation, robust gain/loss calls, and simple segment summaries. It is not a full port of the original CopywriteR workflow; publication-grade analyses should still be validated against the original method or a maintained modern CNV workflow such as CNVkit, PureCN, FACETS, or an LPWGS-specific route.

## Legacy Or Old-Python Tools

When a useful upstream method depends on old Python, old R/Bioconductor, or
platform-specific binaries, Liquid Agent records the installation limitation and
routes users to an available internal proxy or a maintained modern alternative.
Proxy commands state their scope limits and do not claim full upstream equivalence.

<!-- BEGIN CHINESE TRANSLATION -->

---

<a id="chinese"></a>

# 外部工具运行环境（中文）

Liquid Agent 现在可为不属于主 Python 内核的液体活检方法管理专门的外部工具层。此层有意与默认环境分离：严格固定版本的 Python 包、R/Bioconductor 包、Snakemake 工作流、仅有源码的研究代码和系统二进制尽可能在隔离运行环境中安装或检查。

当某个方法不只是建议，而需要确认 Liquid Agent 能否实际调用其运行环境时，使用本页。

## CLI

显示全部注册外部运行环境：

```bash
liquid-agent tools status
```

以 JSON 显示单个运行环境：

```bash
liquid-agent tools status --tool purecn --json
```

常见稳定运行环境的一键准备：

```bash
liquid-agent tools bootstrap
liquid-agent tools bootstrap --execute
```

准备所有可自动安装运行环境：

```bash
liquid-agent tools bootstrap --profile all
liquid-agent tools bootstrap --profile all --execute
```

安装器试运行：

```bash
liquid-agent tools install purecn
```

执行安装器：

```bash
liquid-agent tools install purecn --execute
```

运行冒烟测试：

```bash
liquid-agent tools smoke purecn
```

通过包装器运行命令：

```bash
liquid-agent tools run cnvkit -- cnvkit.py --help
liquid-agent tools run purecn -- Rscript -e "library(PureCN); packageVersion('PureCN')"
liquid-agent tools run dorado_modkit -- modkit --version
```

写入状态报告：

```bash
liquid-agent tools status --output-dir <output_dir>
```

写入文件：

- `liquid_biopsy_external_tool_status.json`
- `liquid_biopsy_external_tool_status.md`

## 状态含义

| 字段 | 含义 |
| --- | --- |
| `installed` | 运行环境、源码检出、可执行文件、Python 模块或 R 包可通过 Liquid Agent 在本地调用。 |
| `ready` | 已安装运行环境，且所有数据专用资源已配置，包括模型检查点、参考 panel、清单或真实输入文件。 |
| `auto_installable` | Liquid Agent 对当前运行环境类别有自动安装/准备路径。 |
| `reimplementation_candidate` | 原工具有价值但无法顺利安装；应优先小型内部替代或现代重新实现，而非让普通用户调试旧依赖。 |
| `compatibility_proxy_*` | 对适合在主 Python 运行时安全复现的实用子集，已有 Liquid Agent 内部实现。 |

运行环境可以 `installed=True` 且 `ready=False`，这很正常。例如 PureCN 可已安装并通过冒烟，但真实分析仍需要区间覆盖表和正常数据库资源。

用户无需手动激活隔离 conda 环境。Liquid Agent 从主进程通过 `conda run -n liquid_tool_purecn ...` 等包装器运行外部命令。

## 注册的运行环境类别

| 类别 | 示例 | Liquid Agent 处理方式 |
| --- | --- | --- |
| 隔离 Python 环境 | MethylBERT, CNVkit, FinaleToolkit, MetDecode, BayesCNV, CpGPT, MethylGPT | 创建专用 conda 环境，检查 Python 模块或 CLI 命令。 |
| 源码检出 | cfDecon, CelFEER, UXM, MethAtlas, cfNOMe, cfDNAFE, EMIT, DeepFRAG | 将源码克隆到 `~/.liquidbiopsy_agent/external_tools/src`，安全时运行注册的冒烟命令。 |
| Snakemake 工作流 | cfDNA UniFlow | 克隆工作流，在隔离环境安装 Snakemake；真实运行需工作流配置和参考。 |
| 隔离 R/Bioconductor 环境 | PureCN, FACETS core | 创建专用 conda R 环境，验证 `Rscript` 和 R 包加载。 |
| 系统二进制包装器 | 纳米孔甲基化 modkit 路径 | 可用时安装/调用 modkit；Dorado 碱基识别仍需用户提供二进制/模型资源。 |
| 重新实现候选 | macOS arm64 上的 CopywriteR | 保持方法可见，记录旧安装失败原因，引导使用内部 CNV 替代或维护中的现代 CNV 方法。 |

## 当前高价值工具

| 信号 | 运行环境/工具 | 当前项目处理 |
| --- | --- | --- |
| 片段组学 | FinaleToolkit | 隔离 Python CLI/运行环境。 |
| 片段组学 | cfDNAFE | 源码检出，兼容时可调用源码 CLI。 |
| 片段组学 | cfDNA UniFlow | Snakemake 工作流包装器；真实运行需配置/参考资源。 |
| 片段组学 | EMIT | 源码/模型检出；真实运行需 EMIT 格式末端基序数据。 |
| 片段组学 | DeepFRAG | 源码检出；真实监督使用需标签、模型资源和验证设计。 |
| 甲基化 | MethylBERT | 隔离 Python 运行环境；真实使用需训练检查点和 read 级甲基化输入。 |
| 甲基化 | cfDecon, CelFEER, UXM, MethAtlas, cfNOMe | 源码检出；真实运行需图谱/标志物/参考资源。 |
| 甲基化 | MetDecode | 隔离 Python/源码环境；真实运行需标志区域甲基化/总 CpG 计数与参考 panel。 |
| 甲基化 | CpGPT, MethylGPT | 隔离 Python/源码环境；真实运行需兼容检查点与矩阵。 |
| 甲基化 | Dorado + modkit | modkit 可安装/调用；Dorado 二进制/模型和纳米孔输入仍为明确前提。 |
| CNV | CNVkit | 隔离 Python CLI/运行环境。 |
| CNV | PureCN | 隔离 R/Bioconductor 环境；真实运行需覆盖度/正常样本/VCF 资源。 |
| CNV | FACETS core | 核心 FACETS 的隔离 R 环境；完整等位基因特异性工作流需 SNP pileup 或平台专用辅助工具。 |
| CNV | BayesCNV | JAX/numpyro 组件的隔离 Python/源码环境。 |
| CNV | CopywriteR | 在 macOS arm64 上旧安装不可靠；列为重新实现候选，并提供内部 CopywriteR 类 CNV 替代。 |

## 内部兼容替代实现

部分有用研究工具绑定旧 Python、旧 R/Bioconductor 或平台特定运行假设。上游实现足够小、开源且算法明确时，Liquid Agent 可提供现代内部替代，而不要求用户修复旧环境。

当前替代：

```bash
liquid-agent copywriter-proxy \
  --input <interval_or_bin_dir> \
  --output-dir <output_dir> \
  --exclude-regions <targets_or_peaks.bed>
```

此替代用于首轮 CopywriteR 类非靶向区域/分箱计数 CNV 筛查，执行区间分箱、可选靶区/峰排除、深度标准化、稳健增益/缺失检测和简单分段汇总。它不是原始 CopywriteR 工作流的完整移植；发表级分析仍应对照原方法，或 CNVkit、PureCN、FACETS、LPWGS 专用路径等维护中的现代 CNV 工作流验证。

## 既有工具或旧 Python 工具

有用方法若依赖旧 Python、旧 R/Bioconductor 或平台专用二进制，Liquid Agent
会记录安装限制，并引导用户使用可用的内部替代或维护中的现代工具。替代命令会
明确说明适用范围，不声称与上游完整实现完全等同。
