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

  # Convert DoltHub SQL console embeds to iframes with fallback link
  sed -i '' -E 's|^\{% embed url="(https://www\.dolthub\.com/repositories/[^"]*embed[^"]*)" %\}|<div class="dolthub-embed-wrapper"><iframe src="\1" class="dolthub-embed" loading="lazy"></iframe><a href="\1" class="dolthub-embed-fallback" target="_blank">Open in DoltHub SQL console \&#x2197;</a></div>|g' "$file"
  # Convert YouTube embeds to iframes
  sed -i '' -E 's|^\{% embed url="(https://(www\.)?youtube\.com/embed/[^"]+)" %\}|<iframe src="\1" class="youtube-embed" allowfullscreen></iframe>|g' "$file"
  # Convert remaining embeds to links
  sed -i '' -E 's/\{% embed url="([^"]+)" %\}/[\1](\1)/g' "$file"

  # Convert internal .md links to clean URLs:
  #   README.md → directory path (strip /README.md)
  #   file.md → file (strip .md)
  #   file.md#anchor → file#anchor (strip .md, keep anchor)
  # Also remap reference/sql/ → sql-reference/ and reference/cli/ → cli-reference/
  sed -i '' -E \
    -e 's|/README\.md\)|/)|g' \
    -e 's|/README\.md#|/#|g' \
    -e 's|\.md\)|)|g' \
    -e 's|\.md#|#|g' \
    -e 's|\(([^)]*)/reference/sql/|(\1/sql-reference/|g' \
    -e 's|\(([^)]*)/reference/cli/|(\1/cli-reference/|g' \
    "$file"

  # Add frontmatter if missing
  if ! head -1 "$file" | grep -q '^---'; then
    title=$(grep -m1 '^# ' "$file" 2>/dev/null | sed 's/^# //' || true)
    if [ -z "$title" ]; then
      title=$(basename "$file" .md | sed 's/-/ /g; s/README/Overview/')
    fi
    tmpfile=$(mktemp)
    printf -- '---\ntitle: "%s"\n---\n\n' "$title" > "$tmpfile"
    cat "$file" >> "$tmpfile"
    mv "$tmpfile" "$file"
  fi

  # Ensure every page has an h1 heading from its frontmatter title.
  # GitBook auto-rendered titles from SUMMARY.md, but Astro doesn't.
  # Only inject if there is NO h1 anywhere in the body after frontmatter.
  title=$(awk '/^---$/{c++; next} c==1 && /^title:/{sub(/^title: */, ""); gsub(/^["'"'"']|["'"'"']$/, ""); print; exit}' "$file")
  if [ -n "$title" ]; then
    has_any_h1=$(awk '/^---$/{c++; next} c>=2 && /^#[[:space:]]/{found=1; exit} END{print found+0}' "$file")
    if [ "$has_any_h1" -eq 0 ]; then
      awk -v h="# $title" 'BEGIN{c=0} /^---$/{c++; if(c==2){print; print ""; print h; next}} {print}' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    fi
  fi
done

echo "Converted GitBook syntax"

# Step 2b: Convert relative links to absolute.
# Relative links break because the browser resolves them against the URL path,
# which differs from the filesystem path (README.md → directory, URL remapping).
echo "Converting relative links to absolute..."

find "$SITE_CONTENT" -name "*.md" -not -path "*/.gitbook/*" | while read -r file; do
  relpath="${file#$SITE_CONTENT/}"

  # Use the ORIGINAL filesystem path as the base for resolving relative links.
  # We remap the resolved result afterwards, not the base.
  if [ "$(basename "$relpath")" = "README.md" ]; then
    url_dir="/$(dirname "$relpath")"
  else
    url_dir="/$(dirname "$relpath")"
  fi
  # Normalize /. to /
  url_dir=$(echo "$url_dir" | sed 's|/\.$|/|; s|/\./|/|g')
  # Ensure trailing slash
  [[ "$url_dir" != */ ]] && url_dir="$url_dir/"

  # Use a python one-liner to resolve relative links to absolute
  python3 -c "
import re, sys
from urllib.parse import urljoin

base = 'http://x${url_dir}'
content = sys.stdin.read()

def resolve_link(m):
    prefix = m.group(1)  # ](
    href = m.group(2)
    suffix = m.group(3)  # )
    # Skip external, anchors, images
    if href.startswith(('http://', 'https://', 'mailto:', '#')):
        return m.group(0)
    if '.gitbook/assets' in href:
        return m.group(0)
    # Split off anchor
    if '#' in href:
        path, anchor = href.split('#', 1)
        anchor = '#' + anchor
    else:
        path, anchor = href, ''
    if not path:
        return m.group(0)
    resolved = urljoin(base, path).replace('http://x', '')
    # Apply URL remapping to the resolved absolute path
    import re as re2
    resolved = re2.sub(r'^/reference/sql/', '/sql-reference/', resolved)
    resolved = re2.sub(r'^/reference/cli/', '/cli-reference/', resolved)
    return prefix + resolved + anchor + suffix

result = re.sub(r'(\]\()([^)]+)(\))', resolve_link, content)
sys.stdout.write(result)
" < "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
done

echo "Converted relative links to absolute"

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
