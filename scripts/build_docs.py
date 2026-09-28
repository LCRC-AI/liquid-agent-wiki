#!/usr/bin/env python3
"""Build two independent, searchable sites from the English-first source docs."""
from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path
import re
import shutil
import tempfile

import yaml
from mkdocs.commands.build import build
from mkdocs.config import load_config

ROOT = Path(__file__).resolve().parents[1]
MARKER = "<!-- BEGIN CHINESE TRANSLATION -->"


def split_document(text: str) -> tuple[str, str]:
    if text.count(MARKER) != 1:
        raise ValueError("Expected exactly one Chinese translation marker")
    english, chinese = text.split(MARKER)
    english = re.sub(r'^<a id="english"></a>\s*\[English\]\(#english\) \| .*?\n', '', english)
    chinese = re.sub(r'^\s*---\s*<a id="chinese"></a>\s*', '', chinese)
    return english.strip() + '\n', chinese.strip() + '\n'


def translated_nav(value, translations):
    if isinstance(value, list):
        return [translated_nav(item, translations) for item in value]
    if isinstance(value, dict):
        return {translations.get(key, key): translated_nav(item, translations) for key, item in value.items()}
    return value


def build_docs(destination: Path) -> None:
    base = yaml.safe_load((ROOT / 'mkdocs.yml').read_text(encoding='utf-8'))
    translations = json.loads((ROOT / 'docs_theme/zh.json').read_text(encoding='utf-8'))
    # Generate in temporary directories; never rewrite the bilingual GitHub sources.
    with tempfile.TemporaryDirectory(prefix='liquid-docs-') as temporary:
        temp = Path(temporary)
        for locale in ('en', 'zh'):
            source = temp / locale
            shutil.copytree(ROOT / 'docs', source)
            for excluded in base.get('exclude_docs', '').splitlines():
                if excluded.strip():
                    (source / excluded.strip()).unlink(missing_ok=True)
            for path in source.rglob('*.md'):
                try:
                    content = split_document(path.read_text(encoding='utf-8'))[locale == 'zh']
                except ValueError as error:
                    raise ValueError(f'{path.relative_to(source)}: {error}') from error
                path.write_text(content, encoding='utf-8')
            shutil.copy2(ROOT / 'frontend/public/liquid-agent-drop-logo-v3.png', source / 'assets/liquid-agent-drop-logo-v3.png')
            for filename in ('ibm-plex-sans.woff2', 'IBM-Plex-Sans-OFL.txt'):
                shutil.copy2(ROOT / 'frontend/src/assets' / filename, source / 'assets' / filename)
            for filename in ('docs.css', 'docs.js'):
                shutil.copy2(ROOT / 'docs_theme' / filename, source / 'assets' / filename)
            config = copy.deepcopy(base)
            config.update(docs_dir=str(source), site_dir=str(destination / locale), strict=True)
            config['theme'].update(custom_dir=str(ROOT / 'docs_theme'), language=locale,
                                   logo='assets/liquid-agent-drop-logo-v3.png', favicon='assets/liquid-agent-drop-logo-v3.png')
            config['plugins'] = [{'search': {'lang': ['en'] if locale == 'en' else ['zh']}}]
            config['extra'] = {'docs_locale': locale, 'alternate': True, 'homepage': '../../#/'}
            config['extra_css'] = ['assets/docs.css']
            config['extra_javascript'] = ['assets/docs.js']
            if locale == 'zh':
                config['nav'] = translated_nav(config['nav'], translations)
            config_path = temp / f'{locale}.yml'
            config_path.write_text(yaml.safe_dump(config, allow_unicode=True, sort_keys=False), encoding='utf-8')
            build(load_config(config_file=str(config_path)))
        destination.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / 'docs_theme/index.html', destination / 'index.html')
        shutil.copy2(destination / 'en/404.html', destination / '404.html')
    print(f'Documentation built: {destination} (en + zh)')


if __name__ == '__main__':
    import logging
    logging.basicConfig(level=logging.WARNING)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'frontend/dist/docs')
    args = parser.parse_args()
    build_docs(args.output.resolve())
