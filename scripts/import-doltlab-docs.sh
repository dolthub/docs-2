#!/bin/bash
# Imports all markdown files from the doltlab docs into the doltlab site.

DOCS_CONTENT="/Users/taylor/go/src/github.com/dolthub/docs/packages/doltlab/content"
SITE_CONTENT="/Users/taylor/go/src/github.com/dolthub/docs-2/site/doltlab/src/content"
SITE_PAGES="/Users/taylor/go/src/github.com/dolthub/docs-2/site/doltlab/src/pages"

# Step 1: Copy markdown files
rm -rf "$SITE_CONTENT"
mkdir -p "$SITE_CONTENT"

cd "$DOCS_CONTENT"
find . -name "*.md" -not -name "SUMMARY.md" | while read -r file; do
  mkdir -p "$SITE_CONTENT/$(dirname "$file")"
  cp "$file" "$SITE_CONTENT/$file"
done

if [ -d "$DOCS_CONTENT/.gitbook/assets" ]; then
  mkdir -p "$SITE_CONTENT/.gitbook/assets"
  cp -r "$DOCS_CONTENT/.gitbook/assets/"* "$SITE_CONTENT/.gitbook/assets/" 2>/dev/null || true
fi

echo "Copied $(find "$SITE_CONTENT" -name "*.md" | wc -l | tr -d ' ') doltlab markdown files"

# Step 2: Convert GitBook syntax + links
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

  # Strip .md extensions from links
  sed -i '' -E \
    -e 's|/README\.md\)|/)|g' \
    -e 's|/README\.md#|/#|g' \
    -e 's|\.md\)|)|g' \
    -e 's|\.md#|#|g' \
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
done

echo "Converted GitBook syntax"

# Step 2b: Convert relative links to absolute
echo "Converting relative links to absolute..."

find "$SITE_CONTENT" -name "*.md" -not -path "*/.gitbook/*" | while read -r file; do
  relpath="${file#$SITE_CONTENT/}"

  if [ "$(basename "$relpath")" = "README.md" ]; then
    url_dir="/$(dirname "$relpath")"
  else
    url_dir="/$(dirname "$relpath")"
  fi

  url_dir=$(echo "$url_dir" | sed 's|/\.$|/|; s|/\./|/|g')
  [[ "$url_dir" != */ ]] && url_dir="$url_dir/"

  python3 -c "
import re, sys
from urllib.parse import urljoin

base = 'http://x${url_dir}'
content = sys.stdin.read()

def resolve_link(m):
    prefix, href, suffix = m.group(1), m.group(2), m.group(3)
    if href.startswith(('http://', 'https://', 'mailto:', '#')):
        return m.group(0)
    if '.gitbook/assets' in href:
        return m.group(0)
    if '#' in href:
        path, anchor = href.split('#', 1)
        anchor = '#' + anchor
    else:
        path, anchor = href, ''
    if not path:
        return m.group(0)
    resolved = urljoin(base, path).replace('http://x', '')
    # DoltLab has no URL remapping — paths match the source structure
    return prefix + resolved + anchor + suffix

result = re.sub(r'(\]\()([^)]+)(\))', resolve_link, content)
sys.stdout.write(result)
" < "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
done

echo "Converted relative links to absolute"

# Step 3: Generate Astro page files
find "$SITE_PAGES" -mindepth 1 -type d -exec rm -rf {} + 2>/dev/null || true

find "$SITE_CONTENT" -name "*.md" -not -path "*/.gitbook/*" | sort | while read -r mdfile; do
  relpath="${mdfile#$SITE_CONTENT/}"

  if [ "$(basename "$relpath")" = "README.md" ]; then
    pagedir=$(dirname "$relpath")
    if [ "$pagedir" = "." ]; then
      continue
    fi
    pagepath="$pagedir"
  else
    pagepath="${relpath%.md}"
  fi

  # DoltLab has no URL remapping

  mkdir -p "$SITE_PAGES/$(dirname "$pagepath")"

  depth=$(echo "$pagepath" | tr '/' '\n' | wc -l | tr -d ' ')
  prefix=""
  for ((i=0; i<depth; i++)); do
    prefix="../$prefix"
  done

  title=$(grep -m1 '^title:' "$mdfile" 2>/dev/null | sed 's/^title: *//; s/^"//; s/"$//; s/^'"'"'//; s/'"'"'$//' || true)
  if [ -z "$title" ]; then
    title=$(grep -m1 '^# ' "$mdfile" 2>/dev/null | sed 's/^# //' || true)
  fi
  if [ -z "$title" ]; then
    title=$(basename "$pagepath" | sed 's/-/ /g')
  fi
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
