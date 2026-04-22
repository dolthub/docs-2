#!/usr/bin/env python3
"""
Reads the original GitBook markdown files for the DoltHub API docs,
parses {% swagger %} tags, loads the referenced OpenAPI spec files,
and generates markdown with inline API endpoint documentation.
"""

import json
import re
import sys
import os

DOCS_ROOT = "/Users/taylor/go/src/github.com/dolthub/docs/packages/dolt/content"
SITE_CONTENT = "/Users/taylor/go/src/github.com/dolthub/docs-2/site/dolt/src/content"

API_DIR = os.path.join(DOCS_ROOT, "products/dolthub/api")
ASSETS_DIR = os.path.join(DOCS_ROOT, ".gitbook/assets/dolthub-api")


def load_spec(spec_path: str) -> dict:
    full_path = os.path.normpath(os.path.join(API_DIR, spec_path))
    with open(full_path) as f:
        return json.load(f)


def render_param(param: dict) -> str:
    name = param.get("name", "")
    location = param.get("in", "")
    desc = param.get("description", "")
    required = param.get("required", False)
    schema = param.get("schema", {})
    ptype = schema.get("type", "")
    example = schema.get("example", "")
    req_label = "Required" if required else "Optional"
    parts = [f"**`{name}`** ({location}, {ptype}, {req_label})"]
    if desc:
        parts.append(f"  {desc}")
    if example:
        parts.append(f"  Example: `{example}`")
    return "\n".join(parts)


def render_request_body(body: dict) -> str:
    lines = ["", "**Request Body**", ""]
    content = body.get("content", {})
    for content_type, schema_info in content.items():
        lines.append(f"Content-Type: `{content_type}`")
        schema = schema_info.get("schema", {})
        props = schema.get("properties", {})
        required_fields = schema.get("required", [])
        if props:
            lines.append("")
            for pname, pinfo in props.items():
                req = "Required" if pname in required_fields else "Optional"
                ptype = pinfo.get("type", "")
                desc = pinfo.get("description", "")
                line = f"- **`{pname}`** ({ptype}, {req})"
                if desc:
                    line += f" — {desc}"
                lines.append(line)
    return "\n".join(lines)


def render_responses(responses: dict) -> str:
    lines = ["", "**Responses**", ""]
    for code, info in responses.items():
        desc = info.get("description", "")
        lines.append(f"- **{code}**: {desc}")
    return "\n".join(lines)


def render_endpoint(spec: dict, path: str, method: str) -> str:
    """Render a single API endpoint as markdown."""
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

    lines = []
    lines.append(f"#### `{method.upper()}` {path}")
    lines.append("")
    if summary:
        lines.append(f"{summary}")
        lines.append("")
    if description:
        lines.append(f"{description}")
        lines.append("")

    lines.append(f"**URL**: `{base_url}{path}`")
    lines.append("")

    if params:
        lines.append("**Parameters**")
        lines.append("")
        for p in params:
            lines.append(render_param(p))
            lines.append("")

    if request_body:
        lines.append(render_request_body(request_body))
        lines.append("")

    if responses:
        lines.append(render_responses(responses))
        lines.append("")

    lines.append("---")
    lines.append("")
    return "\n".join(lines)


def process_file(src_path: str, dest_path: str):
    """Process a markdown file, replacing swagger tags with rendered API docs."""
    with open(src_path) as f:
        content = f.read()

    # Match {% swagger src="..." path="..." method="..." %}...{% endswagger %}
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

        # Apply the same transformations as the import script:
        # Strip .md from links
        result = re.sub(r'/README\.md\)', '/)', result)
        result = re.sub(r'/README\.md#', '/#', result)
        result = re.sub(r'\.md\)', ')', result)
        result = re.sub(r'\.md#', '#', result)

        # Add frontmatter if missing
        if not result.startswith("---"):
            # Extract title from first heading
            title_match = re.search(r'^# (.+)$', result, re.MULTILINE)
            title = title_match.group(1) if title_match else filename.replace(".md", "")
            result = f'---\ntitle: "{title}"\n---\n\n{result}'

        # Ensure h1 exists
        has_h1 = bool(re.search(r'^# ', result, re.MULTILINE))
        if not has_h1:
            title_match = re.search(r'^title:\s*"?(.+?)"?\s*$', result, re.MULTILINE)
            if title_match:
                title = title_match.group(1)
                result = re.sub(r'(^---\n.*?^---\n)', rf'\1\n# {title}\n', result, count=1, flags=re.MULTILINE | re.DOTALL)

        # Convert GitBook hints
        result = result.replace('{% hint style="info" %}', '> **Note**')
        result = result.replace('{% hint style="warning" %}', '> **Warning**')
        result = result.replace('{% endhint %}', '')

        with open(dest, 'w') as f:
            f.write(result)

        print(f"Generated: {dest}")


if __name__ == "__main__":
    main()
