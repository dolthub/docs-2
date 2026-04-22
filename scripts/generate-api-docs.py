#!/usr/bin/env python3
"""
Reads the original GitBook markdown files for the DoltHub API docs,
parses {% swagger %} tags, loads the referenced OpenAPI spec files,
and generates markdown with inline API endpoint documentation.
"""

import json
import re
import os

DOCS_ROOT = "/Users/taylor/go/src/github.com/dolthub/docs/packages/dolt/content"
SITE_CONTENT = "/Users/taylor/go/src/github.com/dolthub/docs-2/site/dolt/src/content"

API_DIR = os.path.join(DOCS_ROOT, "products/dolthub/api")


def load_spec(spec_path: str) -> dict:
    full_path = os.path.normpath(os.path.join(API_DIR, spec_path))
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


def main():
    api_files = ["sql.md", "database.md", "csv.md", "hooks.md", "authentication.md", "README.md"]

    for filename in api_files:
        src = os.path.join(API_DIR, filename)
        dest = os.path.join(SITE_CONTENT, "products/dolthub/api", filename)

        if not os.path.exists(src):
            continue

        result = process_file(src, dest)

        # Strip .md from links
        result = re.sub(r'/README\.md\)', '/)', result)
        result = re.sub(r'/README\.md#', '/#', result)
        result = re.sub(r'\.md\)', ')', result)
        result = re.sub(r'\.md#', '#', result)

        # Add frontmatter if missing
        if not result.startswith("---"):
            title_match = re.search(r'^# (.+)$', result, re.MULTILINE)
            title = title_match.group(1) if title_match else filename.replace(".md", "")
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
