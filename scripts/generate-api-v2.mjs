#!/usr/bin/env node
/**
 * Generates per-tag Markdown pages for the DoltHub v2 API from the OpenAPI spec.
 *
 * Usage:
 *   node scripts/generate-api-v2.mjs
 *
 * Output: site/dolt/src/content/products/dolthub/api/v2/
 *   database.md   — all Database-tagged endpoints
 *   user.md       — User-tagged endpoints
 *   operations.md — Operations-tagged endpoints
 *   models.md     — all component schemas
 *
 * authentication.md and README.md are hand-written; this script does not touch them.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_PATH = join(__dirname, "../specs/dolthub-v2.yaml");
const OUT_DIR = join(
  __dirname,
  "../site/dolt/src/content/products/dolthub/api/v2"
);

const spec = yaml.parse(readFileSync(SPEC_PATH, "utf-8"));

// ---------------------------------------------------------------------------
// $ref resolution (with cycle guard)
// ---------------------------------------------------------------------------

function resolveRef(ref) {
  const parts = ref.replace(/^#\//, "").split("/");
  let obj = spec;
  for (const p of parts) obj = obj[p];
  return obj;
}

function deref(obj, depth = 0) {
  if (depth > 8) return obj; // cycle guard
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((x) => deref(x, depth + 1));
  if ("$ref" in obj) return deref(resolveRef(obj.$ref), depth + 1);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deref(v, depth + 1)])
  );
}

function refName(refStr) {
  return refStr?.split("/").pop();
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const METHOD_LABELS = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
};

function escapeMarkdown(str = "") {
  return str.replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();
}

function methodBadge(method) {
  const colors = {
    get: "009485",
    post: "6DB0FC",
    patch: "FFCA28",
    put: "FFA726",
    delete: "EF5350",
  };
  const color = colors[method] ?? "888888";
  const label = METHOD_LABELS[method] ?? method.toUpperCase();
  return `![${label}](https://img.shields.io/badge/${label}-${color}?style=flat-square)`;
}

function curlExample(method, path, operation) {
  const lines = [
    `curl -X ${METHOD_LABELS[method] ?? method.toUpperCase()} 'https://www.dolthub.com${path}'`,
    `  -H 'Authorization: Bearer YOUR_TOKEN'`,
  ];
  if (method !== "get" && method !== "delete") {
    lines.push(`  -H 'Content-Type: application/json'`);
    const reqBody = operation.requestBody?.content?.["application/json"]?.schema;
    if (reqBody) {
      const resolved = deref(reqBody);
      const required = resolved.required ?? [];
      const props = resolved.properties ?? {};
      const example = Object.fromEntries(
        Object.entries(props)
          .filter(([k]) => required.includes(k))
          .slice(0, 4)
          .map(([k, v]) => {
            const t = v.type ?? (v.enum ? "enum" : "object");
            const ex =
              v.examples?.[0] ??
              v.example ??
              (t === "string" ? `"example_${k}"` : t === "boolean" ? false : 0);
            return [k, ex];
          })
      );
      if (Object.keys(example).length > 0) {
        lines.push(`  -d '${JSON.stringify(example)}'`);
      }
    }
  }
  return lines.join(" \\\n");
}

function parametersSection(params) {
  if (!params?.length) return "";
  const rows = params
    .map((p) => {
      const resolved = deref(p);
      const location = resolved.in ?? "";
      const name = resolved.name ?? "";
      const required = resolved.required ? "yes" : "no";
      const type = resolved.schema?.type ?? "";
      const desc = escapeMarkdown(resolved.description ?? "");
      return `| \`${name}\` | ${location} | ${type} | ${required} | ${desc} |`;
    })
    .join("\n");
  return `\n**Parameters**\n\n| Name | In | Type | Required | Description |\n|------|----|------|----------|-------------|\n${rows}\n`;
}

function requestBodySection(requestBody) {
  if (!requestBody) return "";
  const schema = requestBody.content?.["application/json"]?.schema;
  if (!schema) return "";
  const resolved = deref(schema);
  const required = resolved.required ?? [];
  const props = resolved.properties ?? {};
  if (!Object.keys(props).length) return "";
  const rows = Object.entries(props)
    .map(([k, v]) => {
      const req = required.includes(k) ? "yes" : "no";
      const type = v.type ?? (v.$ref ? refName(v.$ref) : "object");
      const desc = escapeMarkdown(v.description ?? "");
      return `| \`${k}\` | ${type} | ${req} | ${desc} |`;
    })
    .join("\n");
  return `\n**Request body**\n\n| Field | Type | Required | Description |\n|-------|------|----------|-------------|\n${rows}\n`;
}

function responseSchemaName(schema) {
  if (!schema) return "";
  if (schema.$ref) return refName(schema.$ref);
  // Common pattern: allOf: [Envelope, { properties: { data: $ref Schema } }]
  if (schema.allOf) {
    for (const s of schema.allOf) {
      if (s.properties?.data?.$ref) return refName(s.properties.data.$ref);
      // List responses: data.items.$ref
      if (s.properties?.data?.items?.$ref)
        return refName(s.properties.data.items.$ref) + "[]";
    }
  }
  return "";
}

function successExampleBlock(rawResponses) {
  if (!rawResponses) return "";
  const successCode = Object.keys(rawResponses).find((c) => /^2/.test(c));
  if (!successCode) return "";

  const rawResp = rawResponses[successCode];
  const resp = rawResp.$ref ? resolveRef(rawResp.$ref) : rawResp;
  const schema = resp.content?.["application/json"]?.schema;
  if (!schema?.allOf) return "";

  let dataExample = null;
  let isList = false;

  for (const s of schema.allOf) {
    if (s.properties?.data?.$ref) {
      const name = refName(s.properties.data.$ref);
      dataExample = spec.components?.schemas?.[name]?.examples?.[0] ?? null;
      break;
    }
    if (s.properties?.data?.type === "array" && s.properties?.data?.items?.$ref) {
      const name = refName(s.properties.data.items.$ref);
      dataExample = spec.components?.schemas?.[name]?.examples?.[0] ?? null;
      isList = true;
      break;
    }
  }

  if (!dataExample) return "";

  const body = isList
    ? { data: [dataExample], meta: { next_page_token: "eyJvZmZzZXQiOjI1fQ" } }
    : { data: dataExample };

  return `\n**Example response \`${successCode}\`**\n\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`\n`;
}

function responsesSection(rawResponses) {
  if (!rawResponses) return "";
  const rows = Object.entries(rawResponses)
    .map(([code, rawResp]) => {
      // Resolve top-level $ref (e.g. $ref: "#/components/responses/Unauthorized")
      const resp = rawResp.$ref ? resolveRef(rawResp.$ref) : rawResp;
      const desc = escapeMarkdown(resp.description ?? "");
      const schema = resp.content?.["application/json"]?.schema;
      const name = responseSchemaName(schema);
      const schemaLink = name
        ? `[\`${name}\`](models#model-${name.replace("[]", "").toLowerCase()})`
        : "";
      return `| \`${code}\` | ${desc} | ${schemaLink} |`;
    })
    .join("\n");
  return `\n**Responses**\n\n| Status | Description | Schema |\n|--------|-------------|--------|\n${rows}\n`;
}

// ---------------------------------------------------------------------------
// Derive sub-resource label from path (for grouping within the Database page)
// ---------------------------------------------------------------------------

function subResource(path) {
  // After /databases/{owner}/{database}/...
  const m = path.match(
    /^\/api\/v2\/databases\/\{[^}]+\}\/\{[^}]+\}\/([^/]+)/
  );
  if (m) {
    switch (m[1]) {
      case "branches": return "Branches";
      case "tags": return "Tags";
      case "forks": return "Forks";
      case "releases": return "Releases";
      case "sql": return "SQL";
      case "pulls": return "Pull Requests";
      case "imports": return "Imports";
      default: return m[1];
    }
  }
  if (path.startsWith("/api/v2/databases")) return "Databases";
  return "Other";
}

// ---------------------------------------------------------------------------
// Build per-endpoint Markdown block
// ---------------------------------------------------------------------------

function endpointBlock(method, path, operation, headingLevel = "###") {
  const anchor = `{#${operation.operationId}}`;
  const title = operation.summary
    ? operation.summary.replace(/\.$/, "")
    : `${METHOD_LABELS[method]} ${path}`;
  const heading = `${headingLevel} ${title} ${anchor}\n`;
  const methodPath = `\`${METHOD_LABELS[method]} ${path}\`\n\n`;
  const description =
    operation.description &&
    operation.description.trim() !== (operation.summary ?? "").trim()
      ? `${operation.description.trim()}\n\n`
      : "";
  const params = parametersSection(operation.parameters);
  const body = requestBodySection(deref(operation.requestBody ?? {}));
  const responses = responsesSection(operation.responses);
  const successExample = successExampleBlock(operation.responses);
  const curl = `\n**Example request**\n\n\`\`\`sh\n${curlExample(method, path, operation)}\n\`\`\`\n`;
  return [heading, methodPath, description, params, body, curl, responses, successExample]
    .filter(Boolean)
    .join("");
}

// ---------------------------------------------------------------------------
// Collect operations by tag
// ---------------------------------------------------------------------------

const byTag = {}; // tag → [{ method, path, operation }]

for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
  for (const method of [
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "head",
    "options",
  ]) {
    const op = pathItem[method];
    if (!op) continue;
    for (const tag of op.tags ?? ["Untagged"]) {
      if (!byTag[tag]) byTag[tag] = [];
      byTag[tag].push({ method, path, operation: op });
    }
  }
}

// ---------------------------------------------------------------------------
// Tag-level page generators
// ---------------------------------------------------------------------------

function generateTagPage(tag, items, frontmatter) {
  const tagInfo = spec.tags?.find((t) => t.name === tag) ?? {};
  const intro = tagInfo.description ? `${tagInfo.description}\n\n` : "";

  // For Database tag, group by sub-resource
  if (tag === "Database") {
    const groups = {};
    for (const item of items) {
      const g = subResource(item.path);
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    }
    const order = [
      "Databases",
      "SQL",
      "Branches",
      "Tags",
      "Forks",
      "Releases",
      "Pull Requests",
      "Imports",
    ];
    const sorted = [
      ...order.filter((g) => groups[g]),
      ...Object.keys(groups).filter((g) => !order.includes(g)),
    ];
    const sections = sorted
      .map((g) => {
        const endpoints = groups[g]
          .map((item) =>
            endpointBlock(item.method, item.path, item.operation, "###")
          )
          .join("\n---\n\n");
        return `## ${g}\n\n${endpoints}`;
      })
      .join("\n\n");
    return `${frontmatter}\n\n${intro}${sections}\n`;
  }

  // Other tags: flat list
  const content = items
    .map((item) =>
      endpointBlock(item.method, item.path, item.operation, "##")
    )
    .join("\n---\n\n");
  return `${frontmatter}\n\n${intro}${content}\n`;
}

// ---------------------------------------------------------------------------
// Models page
// ---------------------------------------------------------------------------

function schemaBlock(name, schema) {
  const anchor = `{#model-${name.toLowerCase()}}`;
  const heading = `## ${name} ${anchor}\n`;
  const desc = schema.description ? `${schema.description.trim()}\n\n` : "";

  if (schema.enum) {
    const descs = schema["x-enum-descriptions"] ?? [];
    const hasDescs = descs.some(Boolean);
    const values = schema.enum
      .map((v, i) =>
        hasDescs
          ? `| \`${v}\` | ${escapeMarkdown(descs[i] ?? "")} |`
          : `| \`${v}\` |`
      )
      .join("\n");
    const header = hasDescs
      ? `| Value | Description |\n|-------|-------------|`
      : `| Value |\n|-------|`;
    return `${heading}${desc}**Enum values**\n\n${header}\n${values}\n`;
  }

  const props = schema.properties ?? schema.allOf?.find((s) => s.properties)?.properties;
  if (!props || !Object.keys(props).length) {
    const type = schema.type ?? (schema.allOf ? "object" : "");
    return `${heading}${desc}${type ? `_Type: \`${type}\`_\n` : ""}\n`;
  }

  const required = schema.required ?? schema.allOf?.find((s) => s.required)?.required ?? [];
  const rows = Object.entries(props)
    .map(([k, v]) => {
      const req = required.includes(k) ? "yes" : "no";
      const type = v.type ?? (v.$ref ? refName(v.$ref) : v.allOf ? "object" : "object");
      const d = escapeMarkdown(v.description ?? "");
      return `| \`${k}\` | \`${type}\` | ${req} | ${d} |`;
    })
    .join("\n");

  return `${heading}${desc}| Field | Type | Required | Description |\n|-------|------|----------|-------------|\n${rows}\n`;
}

function generateModelsPage() {
  const fm = `---\ntitle: "Models"\ndescription: Request and response schemas for the DoltHub v2 API.\n---\n\n# Models`;
  const schemas = Object.entries(spec.components?.schemas ?? {});
  const blocks = schemas
    .map(([name, schema]) => schemaBlock(name, deref(schema)))
    .join("\n---\n\n");
  return `${fm}\n\nShared request and response types used across the v2 API. See the [error model](#model-problem) for how failures are reported.\n\n${blocks}\n`;
}

// ---------------------------------------------------------------------------
// Write output files
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });

const tagPages = [
  {
    tag: "User",
    file: "user.md",
    frontmatter:
      '---\ntitle: "User"\ndescription: The authenticated user resource in the DoltHub v2 API.\n---\n\n# User',
  },
  {
    tag: "Database",
    file: "database.md",
    frontmatter:
      '---\ntitle: "Database"\ndescription: DoltHub databases, branches, tags, forks, releases, SQL, pull requests, and imports.\n---\n\n# Database',
  },
  {
    tag: "Operations",
    file: "operations.md",
    frontmatter:
      '---\ntitle: "Operations"\ndescription: Long-running async operations in the DoltHub v2 API.\n---\n\n# Operations',
  },
];

for (const { tag, file, frontmatter } of tagPages) {
  const items = byTag[tag] ?? [];
  if (!items.length) {
    console.warn(`Warning: no endpoints found for tag "${tag}"`);
    continue;
  }
  const content = generateTagPage(tag, items, frontmatter);
  writeFileSync(join(OUT_DIR, file), content);
  console.log(`Wrote ${file} (${items.length} endpoints)`);
}

const modelsContent = generateModelsPage();
writeFileSync(join(OUT_DIR, "models.md"), modelsContent);
console.log(`Wrote models.md (${Object.keys(spec.components?.schemas ?? {}).length} schemas)`);
