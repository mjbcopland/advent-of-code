set -euo pipefail

pathname="$1/day/$2/input"

mkdir -p $(dirname $pathname)
wget -O "$pathname.txt" --header="cookie: session=$(cat .session)" "https://adventofcode.com/$pathname"
