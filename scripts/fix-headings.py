#!/usr/bin/env python3
"""
Fixes heading levels in markdown files so that only the page title is h1.
All subsequent h1s (# Heading) are demoted to h2 (## Heading).
Respects code blocks and frontmatter.
"""

import glob
import sys


def fix_headings(filepath: str) -> bool:
    """Fix headings in a file. Returns True if changes were made."""
    with open(filepath) as f:
        lines = f.readlines()

    in_code = False
    in_frontmatter = 0
    found_first_h1 = False
    changed = False
    new_lines = []

    for line in lines:
        stripped = line.strip()

        if stripped == '---':
            in_frontmatter += 1
            new_lines.append(line)
            continue

        if in_frontmatter < 2:
            new_lines.append(line)
            continue

        if stripped.startswith('```'):
            in_code = not in_code
            new_lines.append(line)
            continue

        if not in_code and line.startswith('# '):
            if not found_first_h1:
                # Keep the first h1 as-is (page title)
                found_first_h1 = True
                new_lines.append(line)
            else:
                # Demote subsequent h1s to h2
                new_lines.append('#' + line)
                changed = True
            continue

        new_lines.append(line)

    if changed:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)

    return changed


def main():
    total_fixed = 0
    for site in ['dolt', 'doltlab', 'doltgres']:
        site_fixed = 0
        for filepath in sorted(glob.glob(f'site/{site}/src/content/**/*.md', recursive=True)):
            if '.gitbook' in filepath:
                continue
            if fix_headings(filepath):
                site_fixed += 1
                print(f"  Fixed: {filepath}")
        print(f"{site}: fixed {site_fixed} files")
        total_fixed += site_fixed
    print(f"\nTotal: fixed {total_fixed} files")


if __name__ == '__main__':
    main()
