/**
 * Shared OpenAPI → Markdown docs generator.
 *
 * Both the DoltHub v2 API and the Hosted v1 API are defined by OpenAPI 3.1
 * specs that share an error model (RFC 9457 `Problem`), a success `Envelope`,
 * and cursor pagination — deliberately, so the two public APIs don't disagree
 * about the basics. This module holds the rendering that follows from that
 * shared shape; the per-API scripts supply only what genuinely differs (spec
 * path, output directory, page list, and any tag-level grouping).
 *
 * See scripts/generate-api-v2.mjs and scripts/generate-hosted-api-v1.mjs.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import yaml from "yaml";

const METHOD_LABELS = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
};

// Same palette + markup as the hand-written v1alpha1 pages' .api-method /
// .api-path spans (see site/shared/layouts/DocsLayout.astro), so generated
// endpoint headers match the hand-written ones.
const METHOD_COLORS = {
  get: "29E3C1",
  post: "6DB0FC",
  patch: "F0A35C",
  put: "F0A35C",
  delete: "EF5350",
};

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
];

function escapeMarkdown(str = "") {
  return str.replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();
}

function refName(refStr) {
  return refStr?.split("/").pop();
}

function methodSpan(method) {
  const color = METHOD_COLORS[method] ?? "888888";
  const label = METHOD_LABELS[method] ?? method.toUpperCase();
  return `<span class="api-method" style="background:#${color}">${label}</span>`;
}

/**
 * Builds a renderer bound to one parsed spec. Everything that needs to walk
 * `$ref`s closes over `spec`, so nothing is passed around explicitly.
 */
function createRenderer(spec, { baseUrl, tokenPlaceholder, modelsHref }) {
  // -------------------------------------------------------------------------
  // $ref resolution (with cycle guard)
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Examples
  // -------------------------------------------------------------------------

  // The JSON body of a request or response. Error responses are served as
  // `application/problem+json` (RFC 9457) rather than `application/json`, so
  // looking only at the latter silently drops the Problem schema from every
  // error row. Fall back to any JSON-suffixed media type.
  function jsonBody(carrier) {
    const content = carrier?.content;
    if (!content) return undefined;
    return (
      content["application/json"] ??
      content["application/problem+json"] ??
      Object.entries(content).find(([type]) => /\bjson\b|\+json$/.test(type))?.[1]
    );
  }

  // OpenAPI 3.1 permits a media type to carry named `examples`. Prefer the one
  // named `default`, else the first — a hand-written example beats anything
  // synthesized from the schema.
  function mediaTypeExample(mediaType) {
    if (!mediaType) return undefined;
    const named = mediaType.examples;
    if (named && typeof named === "object") {
      const entry = named.default ?? Object.values(named)[0];
      if (entry && "value" in entry) return entry.value;
    }
    return mediaType.example;
  }

  function requestExample(operation) {
    const media = jsonBody(operation.requestBody);
    const authored = mediaTypeExample(media);
    if (authored !== undefined) return authored;

    // Fall back to a minimal object built from the required properties.
    const schema = media?.schema;
    if (!schema) return undefined;
    const resolved = deref(schema);
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
    return Object.keys(example).length ? example : undefined;
  }

  // A value to stand in for a parameter in a curl example: whatever the spec
  // documents, else the first enum member, else the parameter's own name.
  function parameterExample(param) {
    return (
      param.example ??
      param.schema?.examples?.[0] ??
      param.schema?.example ??
      param.schema?.enum?.[0] ??
      param.name
    );
  }

  // Required query parameters belong in the example URL — without them the
  // command as printed is a 400 rather than something a reader can paste.
  // Optional ones are left out so the example shows the minimal call.
  function requiredQueryString(parameters) {
    const required = (parameters ?? [])
      .map((p) => deref(p))
      .filter((p) => p.in === "query" && p.required);
    if (!required.length) return "";
    const pairs = required.map(
      (p) =>
        `${encodeURIComponent(p.name)}=${encodeURIComponent(String(parameterExample(p)))}`
    );
    return `?${pairs.join("&")}`;
  }

  function curlExample(method, path, operation) {
    const url = `${baseUrl}${path}${requiredQueryString(operation.parameters)}`;
    const lines = [
      `curl -X ${METHOD_LABELS[method] ?? method.toUpperCase()} '${url}'`,
      `  -H 'Authorization: Bearer ${tokenPlaceholder}'`,
    ];
    if (method !== "get" && method !== "delete") {
      lines.push(`  -H 'Content-Type: application/json'`);
      const example = requestExample(operation);
      if (example !== undefined) {
        lines.push(`  -d '${JSON.stringify(example)}'`);
      }
    }
    return lines.join(" \\\n");
  }

  function successExampleBlock(rawResponses) {
    if (!rawResponses) return "";
    const successCode = Object.keys(rawResponses).find((c) => /^2/.test(c));
    if (!successCode) return "";

    const rawResp = rawResponses[successCode];
    const resp = rawResp.$ref ? resolveRef(rawResp.$ref) : rawResp;
    const media = jsonBody(resp);

    // An example authored on the response wins outright — it shows the whole
    // envelope, including any `meta`, exactly as the API returns it.
    const authored = mediaTypeExample(media);
    if (authored !== undefined) {
      return exampleBlock(successCode, authored);
    }

    // Otherwise synthesize the envelope from the schema the endpoint narrows
    // `data` to: allOf: [Envelope, { properties: { data: $ref Schema } }].
    const schema = media?.schema;
    if (!schema?.allOf) return "";

    let dataExample = null;
    let isList = false;

    for (const s of schema.allOf) {
      if (s.properties?.data?.$ref) {
        const name = refName(s.properties.data.$ref);
        dataExample = spec.components?.schemas?.[name]?.examples?.[0] ?? null;
        break;
      }
      if (
        s.properties?.data?.type === "array" &&
        s.properties?.data?.items?.$ref
      ) {
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

    return exampleBlock(successCode, body);
  }

  function exampleBlock(code, body) {
    return `\n**Example response \`${code}\`**\n\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`\n`;
  }

  // -------------------------------------------------------------------------
  // Endpoint sections
  // -------------------------------------------------------------------------

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
    const schema = jsonBody(requestBody)?.schema;
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

  function responsesSection(rawResponses) {
    if (!rawResponses) return "";
    const rows = Object.entries(rawResponses)
      .map(([code, rawResp]) => {
        // Resolve top-level $ref (e.g. $ref: "#/components/responses/Unauthorized")
        const resp = rawResp.$ref ? resolveRef(rawResp.$ref) : rawResp;
        const desc = escapeMarkdown(resp.description ?? "");
        const schema = jsonBody(resp)?.schema;
        const name = responseSchemaName(schema);
        const schemaLink = name
          ? `[\`${name}\`](${modelsHref}#model-${name.replace("[]", "").toLowerCase()})`
          : "";
        return `| \`${code}\` | ${desc} | ${schemaLink} |`;
      })
      .join("\n");
    return `\n**Responses**\n\n| Status | Description | Schema |\n|--------|-------------|--------|\n${rows}\n`;
  }

  function endpointBlock(method, path, operation, headingLevel = "###") {
    const anchor = `{#${operation.operationId}}`;
    const title = operation.summary
      ? operation.summary.replace(/\.$/, "")
      : `${METHOD_LABELS[method]} ${path}`;
    const heading = `${headingLevel} ${title} ${anchor}\n`;
    const methodPath = `${methodSpan(method)} <code class="api-path">${path}</code>\n\n`;
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
    return [
      heading,
      methodPath,
      description,
      params,
      body,
      curl,
      responses,
      successExample,
    ]
      .filter(Boolean)
      .join("");
  }

  // -------------------------------------------------------------------------
  // Models
  // -------------------------------------------------------------------------

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

    const props =
      schema.properties ?? schema.allOf?.find((s) => s.properties)?.properties;
    if (!props || !Object.keys(props).length) {
      const type = schema.type ?? (schema.allOf ? "object" : "");
      return `${heading}${desc}${type ? `_Type: \`${type}\`_\n` : ""}\n`;
    }

    const required =
      schema.required ?? schema.allOf?.find((s) => s.required)?.required ?? [];
    const rows = Object.entries(props)
      .map(([k, v]) => {
        const req = required.includes(k) ? "yes" : "no";
        const type =
          v.type ?? (v.$ref ? refName(v.$ref) : v.allOf ? "object" : "object");
        const d = escapeMarkdown(v.description ?? "");
        return `| \`${k}\` | \`${type}\` | ${req} | ${d} |`;
      })
      .join("\n");

    return `${heading}${desc}| Field | Type | Required | Description |\n|-------|------|----------|-------------|\n${rows}\n`;
  }

  return { deref, endpointBlock, schemaBlock };
}

/**
 * Renders per-tag Markdown pages plus a models page for one OpenAPI spec.
 *
 * @param {object} config
 * @param {string} config.specPath           Absolute path to the OpenAPI YAML.
 * @param {string} config.outDir             Absolute path to write pages into.
 * @param {string} [config.baseUrl]          Base URL for curl examples. Defaults to the spec's first server.
 * @param {string} [config.tokenPlaceholder] Stand-in token in curl examples.
 * @param {Array}  config.tagPages           [{ tag, file, frontmatter, groups? }]
 *   `groups` opts a tag into sub-resource sections: { order: string[], of: (path) => string }.
 * @param {object} config.models             { file, href, frontmatter, intro }
 *   `href` is the site-root-relative path of the models page, e.g.
 *   "/products/hosted/api/v1/models". It must be root-relative rather than a
 *   bare "models": these pages build to `<page>/index.html` and are served
 *   from `<page>/`, so a sibling-relative link would resolve one level too
 *   deep. The rehype base-path plugin prefixes the site base at build time.
 */
export function generateApiDocs(config) {
  const {
    specPath,
    outDir,
    tokenPlaceholder = "YOUR_TOKEN",
    tagPages,
    models,
  } = config;

  const spec = yaml.parse(readFileSync(specPath, "utf-8"));
  const baseUrl = config.baseUrl ?? spec.servers?.[0]?.url ?? "";
  const { deref, endpointBlock, schemaBlock } = createRenderer(spec, {
    baseUrl,
    tokenPlaceholder,
    modelsHref: models.href,
  });

  // Collect operations by tag.
  const byTag = {}; // tag → [{ method, path, operation }]
  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;
      for (const tag of op.tags ?? ["Untagged"]) {
        (byTag[tag] ??= []).push({ method, path, operation: op });
      }
    }
  }

  function generateTagPage(tag, items, { frontmatter, groups }) {
    const tagInfo = spec.tags?.find((t) => t.name === tag) ?? {};
    const intro = tagInfo.description ? `${tagInfo.description}\n\n` : "";

    // Tags with many endpoints across sub-resources get an H2 per sub-resource
    // and endpoints at H3; everything else is a flat list of H2 endpoints.
    if (groups) {
      const grouped = {};
      for (const item of items) {
        (grouped[groups.of(item.path)] ??= []).push(item);
      }
      const sorted = [
        ...groups.order.filter((g) => grouped[g]),
        ...Object.keys(grouped).filter((g) => !groups.order.includes(g)),
      ];
      const sections = sorted
        .map((g) => {
          const endpoints = grouped[g]
            .map((item) =>
              endpointBlock(item.method, item.path, item.operation, "###")
            )
            .join("\n---\n\n");
          return `## ${g}\n\n${endpoints}`;
        })
        .join("\n\n");
      return `${frontmatter}\n\n${intro}${sections}\n`;
    }

    const content = items
      .map((item) => endpointBlock(item.method, item.path, item.operation, "##"))
      .join("\n---\n\n");
    return `${frontmatter}\n\n${intro}${content}\n`;
  }

  mkdirSync(outDir, { recursive: true });

  for (const page of tagPages) {
    const items = byTag[page.tag] ?? [];
    if (!items.length) {
      console.warn(`Warning: no endpoints found for tag "${page.tag}"`);
      continue;
    }
    writeFileSync(
      join(outDir, page.file),
      generateTagPage(page.tag, items, page)
    );
    console.log(`Wrote ${page.file} (${items.length} endpoints)`);
  }

  const schemas = Object.entries(spec.components?.schemas ?? {});
  const blocks = schemas
    .map(([name, schema]) => schemaBlock(name, deref(schema)))
    .join("\n---\n\n");
  writeFileSync(
    join(outDir, models.file),
    `${models.frontmatter}\n\n${models.intro}\n\n${blocks}\n`
  );
  console.log(`Wrote ${models.file} (${schemas.length} schemas)`);
}
