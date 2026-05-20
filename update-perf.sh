#!/bin/bash

# Splices a fresh benchmark table and version line into the Dolt
# latency/correctness docs. Invoked by the ld repo's
# ci-update-docs-latency-correctness workflow after it checks out
# docs-2 and downloads the formatted-table artifacts.
#
# Ported from dolthub/docs:update-perf.sh (gitbook-dev); only
# sql_reference_dir changes to point at the Astro layout.

set -ex
set -o pipefail

version=""
storage_format=""
sed_cmd_i=""
start_marker=""
end_marker=""
dest_file=""

os_type="darwin"

sql_reference_dir="site/dolt/src/content/reference/sql/benchmarks"

start_template='<!-- START_%s_%s_RESULTS_TABLE -->'
end_template='<!-- END_%s_%s_RESULTS_TABLE -->'

if [ "$#" -ne 4 ]; then
  echo "usage: update-perf.sh <version> <format> <type: latency/correctness> <filepath>"
  exit 1;
fi

version="$1"
storage_format="$2"
type="$3"
new_table="$4"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  os_type="linux"
fi

if [[ "$storage_format" != "__DOLT__" ]]; then
  echo "only __DOLT__ supported in docs"
  exit 1
fi

if [ "$type" == "latency" ]
then
  dest_file="$sql_reference_dir/latency.md"

  # update the version
  if [ "$os_type" == "linux" ]
  then
    sed -i 's/The Dolt version is `'".*"'`/The Dolt version is `'"$version"'`/' "$dest_file"
  else
    sed -i '' "s/The Dolt version is \\\`.*\\\`/The Dolt version is \\\`$version\\\`/" "$dest_file"
  fi

  start_marker=$(printf "$start_template" "$storage_format" "LATENCY")
  end_marker=$(printf "$end_template" "$storage_format" "LATENCY")

else
  dest_file="$sql_reference_dir/correctness.md"

  # update the version
  if [ "$os_type" == "linux" ]
  then
    sed -i 's/Here are Dolt'"'"'s sqllogictest results for version `'".*"'`./Here are Dolt'"'"'s sqllogictest results for version `'"$version"'`./' "$dest_file"
  else
    sed -i '' 's/Here are Dolt'"'"'s sqllogictest results for version `'".*"'`./Here are Dolt'"'"'s sqllogictest results for version `'"$version"'`./' "$dest_file"
  fi

  start_marker=$(printf "$start_template" "$storage_format" "CORRECTNESS")
  end_marker=$(printf "$end_template" "$storage_format" "CORRECTNESS")
fi

# store in variable
updated=$(cat "$new_table")
updated_with_markers=$(printf "$start_marker\n$updated\n$end_marker\n")

echo "$updated_with_markers" > "$new_table"

# replace table in the proper file
if [ "$os_type" == "linux" ]
then
  sed -e '/<!-- END_'"$storage_format"'/r '"$new_table"'' -e '/<!-- START_'"$storage_format"'/,/<!-- END_'"$storage_format"'/d' "$dest_file" > temp.md
else
  sed -e '/\<!-- END_'"$storage_format"'/r '"$new_table"'' -e '/\<!-- START_'"$storage_format"'/,/\<!-- END_'"$storage_format"'/d' "$dest_file" > temp.md
fi

mv temp.md "$dest_file"
