#!/bin/bash
# Imports all markdown files from the docs repo into the dolt site,
# converting GitBook-specific syntax to standard markdown.

DOCS_CONTENT="/Users/taylor/go/src/github.com/dolthub/docs/packages/dolt/content"
SITE_CONTENT="/Users/taylor/go/src/github.com/dolthub/docs-2/site/dolt/src/content"
SITE_PAGES="/Users/taylor/go/src/github.com/dolthub/docs-2/site/dolt/src/pages"

# Step 1: Copy markdown files
rm -rf "$SITE_CONTENT"
mkdir -p "$SITE_CONTENT"

cd "$DOCS_CONTENT"
find . -name "*.md" -not -name "SUMMARY.md" | while read -r file; do
  mkdir -p "$SITE_CONTENT/$(dirname "$file")"
  cp "$file" "$SITE_CONTENT/$file"
done

# Copy images
if [ -d "$DOCS_CONTENT/.gitbook/assets" ]; then
  mkdir -p "$SITE_CONTENT/.gitbook/assets"
  cp -r "$DOCS_CONTENT/.gitbook/assets/"* "$SITE_CONTENT/.gitbook/assets/" 2>/dev/null || true
fi

echo "Copied $(find "$SITE_CONTENT" -name "*.md" | wc -l | tr -d ' ') markdown files"

# Step 2: Convert GitBook syntax
find "$SITE_CONTENT" -name "*.md" | while read -r file; do
  sed -i '' \
    -e 's/{% hint style="info" %}/> **Note**/g' \
    -e 's/{% hint style="warning" %}/> **Warning**/g' \
    -e 's/{% hint style="danger" %}/> **Danger**/g' \
    -e 's/{% hint style="success" %}/> **Tip**/g' \
    -e 's/{% endhint %}//g' \
    -e 's/{% swagger.*%}/<!-- API spec embed removed -->/g' \
    -e 's/{% endswagger %}//g' \
    "$file"

  sed -i '' -E 's/\{% embed url="([^"]+)" %\}/[\1](\1)/g' "$file"

  # Add frontmatter if missing
  if ! head -1 "$file" | grep -q '^---'; then
    title=$(grep -m1 '^# ' "$file" 2>/dev/null | sed 's/^# //' || true)
    if [ -z "$title" ]; then
      # Use filename as fallback title
      title=$(basename "$file" .md | sed 's/-/ /g; s/README/Overview/')
    fi
    tmpfile=$(mktemp)
    printf -- '---\ntitle: "%s"\n---\n\n' "$title" > "$tmpfile"
    cat "$file" >> "$tmpfile"
    mv "$tmpfile" "$file"
  fi
done

echo "Converted GitBook syntax"

# Step 3: Generate Astro page files
# First, clean all generated page dirs (but keep root index.astro)
find "$SITE_PAGES" -mindepth 1 -type d -exec rm -rf {} + 2>/dev/null || true

find "$SITE_CONTENT" -name "*.md" -not -path "*/.gitbook/*" | sort | while read -r mdfile; do
  relpath="${mdfile#$SITE_CONTENT/}"

  # Determine URL path
  if [ "$(basename "$relpath")" = "README.md" ]; then
    pagedir=$(dirname "$relpath")
    if [ "$pagedir" = "." ]; then
      continue  # Skip root README — we have index.astro
    fi
    pagepath="$pagedir"
  else
    pagepath="${relpath%.md}"
  fi

  # Remap URL paths to match the live site's structure:
  #   reference/sql/* → sql-reference/*
  #   reference/cli/* → cli-reference/*
  pagepath=$(echo "$pagepath" | sed 's|^reference/sql/|sql-reference/|; s|^reference/cli/|cli-reference/|')

  # Create directory
  mkdir -p "$SITE_PAGES/$(dirname "$pagepath")"

  # Build relative path prefix from page to layouts dir
  depth=$(echo "$pagepath" | tr '/' '\n' | wc -l | tr -d ' ')
  prefix=""
  for ((i=0; i<depth; i++)); do
    prefix="../$prefix"
  done

  # Extract title
  title=$(grep -m1 '^title:' "$mdfile" 2>/dev/null | sed 's/^title: *//; s/^"//; s/"$//; s/^'"'"'//; s/'"'"'$//' || true)
  if [ -z "$title" ]; then
    title=$(grep -m1 '^# ' "$mdfile" 2>/dev/null | sed 's/^# //' || true)
  fi
  if [ -z "$title" ]; then
    title=$(basename "$pagepath" | sed 's/-/ /g')
  fi
  # Escape double quotes for the Astro template
  title=$(echo "$title" | sed 's/"/\\"/g')

  cat > "$SITE_PAGES/$pagepath.astro" << ASTROEOF
---
import DocsLayout from "${prefix}layouts/DocsLayout.astro";

const post = await import("${prefix}content/${relpath}");
const Content = post.Content;
---

<DocsLayout title="${title}">
  <Content />
</DocsLayout>
ASTROEOF

done

echo "Generated $(find "$SITE_PAGES" -name "*.astro" | wc -l | tr -d ' ') Astro page files"
echo "Done!"
