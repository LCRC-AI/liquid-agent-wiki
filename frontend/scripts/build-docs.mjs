import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const python = process.env.LIQUID_AGENT_PYTHON || process.env.PYTHON || 'python';
const script = fileURLToPath(new URL('../../scripts/build_docs.py', import.meta.url));
const result = spawnSync(python, [script], { stdio: 'inherit' });
if (result.error || result.status !== 0) {
  console.error('Docs build failed. Check the error above and the selected Python interpreter. Missing MkDocs dependencies can be installed with: python -m pip install -e ".[docs]"');
  process.exit(result.status || 1);
}
