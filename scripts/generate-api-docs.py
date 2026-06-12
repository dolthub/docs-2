#!/usr/bin/env python3
"""
Generates the DoltHub API docs from in-repo sources.

Inputs (all in this repo):
  - Markdown templates with {% swagger %} tags:
        scripts/api-source/*.md
  - OpenAPI / swagger JSON specs referenced by the templates:
        site/dolt/src/content/.gitbook/assets/dolthub-api/*.json

Output:
        site/dolt/src/content/products/dolthub/api/*.md  (rendered)

Override the defaults with env vars TEMPLATES_DIR / ASSETS_DIR / OUT_DIR
if you ever need to. No upstream dolthub/docs checkout required.
"""

import json
import re
import os
from pathlib import Path


def _resolve_path(env_var: str, *default_parts: str) -> str:
    env_value = os.environ.get(env_var)
    if env_value:
        return env_value
    repo_root = Path(__file__).resolve().parent.parent
    return str(repo_root.joinpath(*default_parts))


TEMPLATES_DIR = _resolve_path("TEMPLATES_DIR", "scripts", "api-source")
ASSETS_DIR = _resolve_path(
    "ASSETS_DIR", "site", "dolt", "src", "content", ".gitbook", "assets", "dolthub-api"
)
OUT_DIR = _resolve_path(
    "OUT_DIR", "site", "dolt", "src", "content", "products", "dolthub", "api"
)


def load_spec(spec_path: str) -> dict:
    # Templates carry legacy relative paths like
    # "../../../.gitbook/assets/dolthub-api/<name>.json"; we only need the
    # filename and look it up under ASSETS_DIR (the in-repo JSON dir).
    name = os.path.basename(spec_path)
    full_path = os.path.join(ASSETS_DIR, name)
    with open(full_path) as f:
        return json.load(f)


METHOD_COLORS = {
    "get": "#29E3C1",
    "post": "#6DB0FC",
    "put": "#F0A35C",
    "patch": "#F0A35C",
    "delete": "#E35D5D",
}


def render_endpoint(spec: dict, path: str, method: str) -> str:
    """Render a single API endpoint as an HTML block."""
    path_obj = spec.get("paths", {}).get(path, {})
    op = path_obj.get(method, {})
    if not op:
        return f"> API endpoint `{method.upper()} {path}` — spec not found\n"

    summary = op.get("summary", "")
    description = op.get("description", "")
    params = op.get("parameters", [])
    request_body = op.get("requestBody", None)
    responses = op.get("responses", {})

    servers = spec.get("servers", [])
    base_url = servers[0]["url"] if servers else ""

    color = METHOD_COLORS.get(method, "#999")
    method_upper = method.upper()

    lines = []
    lines.append(f'<div class="api-endpoint">')
    lines.append(f'<div class="api-endpoint-header">')
    lines.append(f'<span class="api-method" style="background:{color}">{method_upper}</span>')
    lines.append(f'<code class="api-path">{path}</code>')
    lines.append(f'</div>')

    if summary:
        lines.append(f'<p class="api-summary">{summary}</p>')
    if description and description != summary:
        lines.append(f'<p class="api-description">{description}</p>')

    lines.append(f'<div class="api-url"><strong>URL</strong> <code>{base_url}{path}</code></div>')

    if params:
        lines.append('<div class="api-section">')
        lines.append('<h5>Parameters</h5>')
        lines.append('<table class="api-params">')
        lines.append('<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>')
        lines.append('<tbody>')
        for p in params:
            name = p.get("name", "")
            location = p.get("in", "")
            schema = p.get("schema", {})
            ptype = schema.get("type", "")
            required = "Yes" if p.get("required", False) else "No"
            desc = p.get("description", "")
            example = str(schema.get("example", ""))
            if example:
                desc += f' <em>Example: <code class="api-example">{example}</code></em>'
            lines.append(f'<tr><td><code>{name}</code></td><td>{location}</td><td>{ptype}</td><td>{required}</td><td>{desc}</td></tr>')
        lines.append('</tbody></table>')
        lines.append('</div>')

    if request_body:
        lines.append('<div class="api-section">')
        lines.append('<h5>Request Body</h5>')
        content = request_body.get("content", {})
        for content_type, schema_info in content.items():
            lines.append(f'<p>Content-Type: <code>{content_type}</code></p>')
            schema = schema_info.get("schema", {})
            props = schema.get("properties", {})
            required_fields = schema.get("required", [])
            if props:
                lines.append('<table class="api-params">')
                lines.append('<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>')
                lines.append('<tbody>')
                for pname, pinfo in props.items():
                    req = "Yes" if pname in required_fields else "No"
                    ptype = pinfo.get("type", "")
                    desc = pinfo.get("description", "")
                    lines.append(f'<tr><td><code>{pname}</code></td><td>{ptype}</td><td>{req}</td><td>{desc}</td></tr>')
                lines.append('</tbody></table>')
        lines.append('</div>')

    if responses:
        lines.append('<div class="api-section">')
        lines.append('<h5>Responses</h5>')
        for code, info in responses.items():
            desc = info.get("description", "")
            code_class = "api-status-success" if str(code).startswith("2") else "api-status-error"
            lines.append(f'<div class="api-response"><span class="{code_class}">{code}</span> {desc}</div>')
        lines.append('</div>')

    lines.append('</div>')
    lines.append('')
    return "\n".join(lines)


def process_file(src_path: str, dest_path: str):
    """Process a markdown file, replacing swagger tags with rendered API docs."""
    with open(src_path) as f:
        content = f.read()

    pattern = r'\{% swagger src="([^"]+)" path="([^"]+)" method="([^"]+)" %\}\n.*?\n\{% endswagger %\}'

    def replace_swagger(m):
        spec_path = m.group(1)
        path = m.group(2)
        method = m.group(3)
        try:
            spec = load_spec(spec_path)
            return render_endpoint(spec, path, method)
        except Exception as e:
            return f"> Failed to render API spec: {e}\n"

    result = re.sub(pattern, replace_swagger, content, flags=re.DOTALL)
    return result


# ---------------------------------------------------------------------------
# Endpoint index — a single agent- and human-readable table of every endpoint
# in every API page, generated alongside the pages themselves so it can't
# drift. Substituted into pages at the `<!-- ENDPOINT_INDEX -->` marker
# (currently v1alpha1/README.md).
# ---------------------------------------------------------------------------


# Site-absolute base used to build index links. rehype-base prepends `/docs`
# at build time, so the rendered HTML carries
# `/docs/products/dolthub/api/<rel-path>#<anchor>` — a stable absolute path
# that works regardless of which URL the index page itself is served at
# (the README's URL may or may not carry a trailing slash, which would break
# browser-side resolution of relative links).
API_BASE = "/products/dolthub/api"


def slugify(text: str) -> str:
    """Mirror rehype-slug / github-slugger output for ASCII headings — the
    same algorithm Astro applies to <h2> id attributes."""
    s = text.lower()
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


def section_title_from_template(content: str, fallback: str) -> str:
    """Best-effort label for the section heading in the index. Prefers the
    frontmatter title, falls back to the H1, then to the filename."""
    m = re.search(r'^title:\s*"?(.+?)"?\s*$', content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    m = re.search(r"^# (.+)$", content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return fallback


def collect_endpoints(rel_path: str) -> tuple[str, list[dict]]:
    """Walk one template, return (section_title, list of endpoint dicts).
    Each endpoint dict carries the method, path, summary (from the swagger
    spec) plus the page slug (relative to the api base) + anchor where its
    doc section lives."""
    src_path = os.path.join(TEMPLATES_DIR, rel_path)
    if not os.path.exists(src_path):
        return ("", [])
    with open(src_path) as f:
        content = f.read()

    section_title = section_title_from_template(content, rel_path)

    # Page slug used in the link is the rel_path without the .md suffix.
    # READMEs serve at the directory URL — drop the trailing /README so
    # the link is /<base>/<dir> rather than /<base>/<dir>/README.
    page_slug = rel_path[: -len(".md")]
    if page_slug.endswith("/README"):
        page_slug = page_slug[: -len("/README")]
    elif page_slug == "README":
        page_slug = ""

    endpoints: list[dict] = []
    last_h2_slug: str | None = None
    swagger_re = re.compile(
        r'^\{% swagger src="([^"]+)" path="([^"]+)" method="([^"]+)" %\}'
    )
    for line in content.split("\n"):
        h2 = re.match(r"^## (.+)$", line)
        if h2:
            last_h2_slug = slugify(h2.group(1))
            continue
        m = swagger_re.match(line)
        if not m:
            continue
        spec_path, path, method = m.group(1), m.group(2), m.group(3)
        try:
            spec = load_spec(spec_path)
        except Exception:
            continue
        op = spec.get("paths", {}).get(path, {}).get(method.lower(), {})
        endpoints.append(
            {
                "method": method.upper(),
                "path": path,
                "summary": op.get("summary", "").strip(),
                "page": page_slug,
                "anchor": last_h2_slug or "",
            }
        )
    return (section_title, endpoints)


def render_endpoint_index(sections: list[tuple[str, list[dict]]]) -> str:
    """Render a grouped Markdown table of every endpoint, sectioned by page.
    Sections appear in the order the caller supplied (we use nav order).
    Each row links the summary text to the doc anchor."""
    out: list[str] = []
    for section_title, endpoints in sections:
        if not endpoints:
            continue
        out.append(f"### {section_title}")
        out.append("")
        out.append("| Method | Path | What it does |")
        out.append("|---|---|---|")
        for e in endpoints:
            summary = e["summary"].replace("|", r"\|") or "—"
            link = f"{API_BASE}/{e['page']}" if e["page"] else API_BASE
            if e["anchor"]:
                link += f"#{e['anchor']}"
            out.append(
                f"| **{e['method']}** | `{e['path']}` | [{summary}]({link}) |"
            )
        out.append("")
    return "\n".join(out)


def build_endpoint_index(api_files: list[str]) -> str:
    """Collect endpoints from every endpoint-bearing template and render."""
    sections: list[tuple[str, list[dict]]] = []
    for rel_path in api_files:
        # Skip files that don't carry endpoints — landing pages, the legacy
        # stub (whose H2s point at the v1alpha1 pages rather than wrapping
        # swagger tags), and the prose-only narrative pages.
        if rel_path in ("README.md", "database.md", "csv.md", "hooks.md"):
            continue
        if rel_path.endswith("/README.md"):
            continue
        title, endpoints = collect_endpoints(rel_path)
        if endpoints:
            sections.append((title, endpoints))
    return render_endpoint_index(sections)


def main():
    api_files = [
        # Top-level landing pages — not version-specific.
        "README.md",
        # Independent APIs (separate surfaces, not part of v1alpha1).
        "csv.md",
        "hooks.md",
        # Legacy stub: keeps /products/dolthub/api/database#<anchor> deep
        # links alive after the split. Every old H2 ID is preserved; each
        # body is a one-line pointer to the new home under v1alpha1/.
        "database.md",
        # v1alpha1 API surface.
        "v1alpha1/README.md",
        "v1alpha1/authentication.md",
        "v1alpha1/sql.md",
        "v1alpha1/user.md",
        "v1alpha1/databases.md",
        "v1alpha1/branches.md",
        "v1alpha1/pull-requests.md",
        "v1alpha1/releases.md",
        "v1alpha1/tags.md",
        "v1alpha1/uploads.md",
        "v1alpha1/jobs.md",
    ]

    # Build the endpoint index once off the same swagger sources every page
    # consumes. Substituted into any template carrying a
    # `<!-- ENDPOINT_INDEX -->` marker (currently v1alpha1/README.md).
    endpoint_index = build_endpoint_index(api_files)

    for rel_path in api_files:
        src = os.path.join(TEMPLATES_DIR, rel_path)
        dest = os.path.join(OUT_DIR, rel_path)

        if not os.path.exists(src):
            continue

        # Output may live in a subdir (v1alpha1/), so make sure it exists.
        os.makedirs(os.path.dirname(dest), exist_ok=True)

        result = process_file(src, dest)

        # Substitute the endpoint index in place of its marker. No-op on
        # pages without the marker, so it's safe to apply everywhere.
        result = result.replace("<!-- ENDPOINT_INDEX -->", endpoint_index)

        # Strip .md from links
        result = re.sub(r'/README\.md\)', '/)', result)
        result = re.sub(r'/README\.md#', '/#', result)
        result = re.sub(r'\.md\)', ')', result)
        result = re.sub(r'\.md#', '#', result)

        # Add frontmatter if missing
        if not result.startswith("---"):
            title_match = re.search(r'^# (.+)$', result, re.MULTILINE)
            title = (
                title_match.group(1)
                if title_match
                else os.path.basename(rel_path).replace(".md", "")
            )
            result = f'---\ntitle: "{title}"\n---\n\n{result}'

        # Ensure h1 exists
        has_h1 = bool(re.search(r'^# ', result, re.MULTILINE))
        if not has_h1:
            title_match = re.search(r'^title:\s*"?(.+?)"?\s*$', result, re.MULTILINE)
            if title_match:
                title = title_match.group(1)
                result = re.sub(
                    r'(^---\n.*?^---\n)',
                    rf'\1\n# {title}\n',
                    result, count=1, flags=re.MULTILINE | re.DOTALL
                )

        # Convert GitBook hints
        result = result.replace('{% hint style="info" %}', '> **Note**')
        result = result.replace('{% hint style="warning" %}', '> **Warning**')
        result = result.replace('{% endhint %}', '')

        with open(dest, 'w') as f:
            f.write(result)

        print(f"Generated: {dest}")


if __name__ == "__main__":
    main()
