"""Check built portal/docs links, including return-home links under a URL prefix.

Run after the frontend and bilingual documentation builds. No server is needed.
This complements real browser interaction testing; it does not replace it.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.home = []
        self.anchors = []
        self._anchor = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.references.extend(attrs[key] for key in ("href", "src") if attrs.get(key))
        classes = attrs.get("class", "").split()
        if tag == "a":
            self._anchor = {"href": attrs.get("href", ""), "text": "", "class": classes}
            if "docs-home" in classes or "md-header__title" in classes or "md-logo" in classes:
                self.home.append(attrs.get("href", ""))

    def handle_data(self, data):
        if self._anchor is not None:
            self._anchor["text"] += data

    def handle_endtag(self, tag):
        if tag == "a" and self._anchor is not None:
            self.anchors.append(self._anchor)
            self._anchor = None


def check(root: Path):
    count = 0
    docs = 0
    errors = []
    pages = list(root.rglob("*.html"))
    if not (root / "docs/en/index.html").is_file() or not (root / "docs/zh/index.html").is_file():
        raise SystemExit("Build both language versions of the documentation first.")
    for file in pages:
        relative = file.relative_to(root).as_posix()
        parser = Links()
        parser.feed(file.read_text(encoding="utf-8"))
        if relative in ("docs/en/getting-started/installation/index.html", "docs/zh/getting-started/installation/index.html"):
            waitlist = [anchor for anchor in parser.anchors if anchor["text"].strip() == "Join the Waitlist"]
            if len(waitlist) != 1 or "md-button--primary" not in waitlist[0]["class"]:
                errors.append(f"{relative}: expected one primary Join the Waitlist link")
        base = "https://portal.test/" + relative
        for ref in parser.references:
            target_url = urlsplit(urljoin(base, ref))
            if target_url.netloc != "portal.test":
                continue
            target = root / unquote(target_url.path.lstrip("/"))
            if target.is_dir():
                target /= "index.html"
            count += 1
            if not target.is_file():
                errors.append(f"{relative}: missing {ref}")
        if relative.startswith(("docs/en/", "docs/zh/")) and file.name == "index.html":
            docs += 1
            if len(parser.home) != 4:
                errors.append(f"{relative}: expected header/mobile logos, brand title and back-to-home links")
            for prefix in ("/", "/liquid-agent-wiki/"):
                for ref in parser.home:
                    actual = urljoin("https://portal.test" + prefix + relative, ref)
                    expected = "https://portal.test" + prefix + "#/"
                    if actual != expected:
                        errors.append(f"{relative}: {actual} != {expected}")
    if errors:
        raise SystemExit("\n".join(errors))
    portal_javascript = "\n".join(path.read_text(encoding="utf-8") for path in (root / "assets").glob("*.js"))
    if "getting-started/installation/" not in portal_javascript or "launch=1" in portal_javascript:
        raise SystemExit("Built Try it actions must open installation documentation without a launch/probe query.")
    if (root / "docs/en/assets/workspace-handoff.js").exists() or (root / "docs/zh/assets/workspace-handoff.js").exists():
        raise SystemExit("Local-workspace handoff script must not be included in the public docs build.")
    print(f"PASS: {count} local references; {docs} documentation pages with four working home links at root and under a project prefix.")


if __name__ == "__main__":
    check(Path(__file__).resolve().parents[1] / "frontend/dist")
