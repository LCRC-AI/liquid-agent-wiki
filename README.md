# LIQUID-Agent Wiki

This repository contains the public LIQUID-Agent homepage, feature overview, use cases, installation guide, and user documentation. It is a static site and does not run analyses or receive private liquid-biopsy data.

- Public site: <https://lcrc-ai.github.io/liquid-agent-wiki/>
- Release repository: <https://github.com/LCRC-AI/liquid-agent-release>

## Local preview

```bash
python -m pip install -r docs_theme/requirements.txt
npm ci --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend -- --port 4174
```

The generated site is written to `frontend/dist/`. GitHub Actions can deploy that directory to GitHub Pages after the repository is created.

---

# LIQUID-Agent Wiki

本仓库包含公开的 LIQUID-Agent 产品主页、功能说明、用例展示、安装教程与用户文档。它是纯静态网站，不执行分析，也不接收私有液体活检数据。

- 公开网站：<https://lcrc-ai.github.io/liquid-agent-wiki/>
- 发布版本仓库：<https://github.com/LCRC-AI/liquid-agent-release>
