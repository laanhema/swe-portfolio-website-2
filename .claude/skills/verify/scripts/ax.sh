#!/usr/bin/env bash
# Thin wrapper over chrome-devtools-axi for laanhema.dev verification runs.
# Always runs in the isolated browser session $CHROME_DEVTOOLS_AXI_SESSION (default: verify).
#
#   ax.sh open <path>                 open http://127.0.0.1:$VERIFY_PORT<path>
#   ax.sh click '<snapshot regex>'    take a fresh snapshot, click the first line matching the ERE
#                                     e.g. ax.sh click 'link "READ STORY" url=.*/blog/tralla'
#   ax.sh has '<snapshot regex>'      exit 0 if the current snapshot has a matching line (prints it)
#   ax.sh state                       print {path, hash, scrollY, h1, menuExpanded}
#   ax.sh shot <file.png> [--full-page]
#   ax.sh aria <file.txt>             save the full accessibility snapshot
#   ax.sh mobile | desktop            viewport 375x812 mobile+touch | 1280x900
#   ax.sh stop                        stop this session's browser bridge
set -euo pipefail
export CHROME_DEVTOOLS_AXI_SESSION="${CHROME_DEVTOOLS_AXI_SESSION:-verify}"
PORT="${VERIFY_PORT:-$(cat "$(git rev-parse --show-toplevel)/.temp/verify/server.port" 2>/dev/null || echo 5199)}"
axi() { chrome-devtools-axi "$@"; }

case "${1:-}" in
  open) axi open "http://127.0.0.1:$PORT${2:-/}" >/dev/null && echo "opened ${2:-/}" ;;
  click)
    # Refs are generation-tagged: a ref from an older snapshot is STALE, so look up and click in one go.
    line="$(axi snapshot --full | grep -E -m1 -- "$2" || true)"
    [[ -n "$line" ]] || { echo "no snapshot line matches: $2" >&2; exit 1; }
    uid="$(grep -o 'uid=[^ ]*' <<<"$line" | head -1 | cut -d= -f2)"
    echo "click: $line"
    axi click "@$uid" >/dev/null ;;
  has) axi snapshot --full | grep -E -m1 -- "$2" ;;
  state)
    axi eval "({path: location.pathname, hash: location.hash, scrollY: Math.round(scrollY), h1: document.querySelector('h1')?.textContent?.trim(), menuExpanded: document.querySelector('button[aria-controls=mobile-menu]')?.getAttribute('aria-expanded') ?? null})" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.dumps(json.loads(json.loads(sys.stdin.read()))))' ;;
  shot)
    # After `emulate`, the CLI reports BROWSER_ERROR even though the file is written; trust the file.
    rm -f "$2"; axi screenshot "$(realpath -m "$2")" "${@:3}" >/dev/null 2>&1 || true
    [[ -s "$2" ]] && echo "saved $2" || { echo "screenshot not written: $2" >&2; exit 1; } ;;
  aria) axi snapshot --full >"$2" && echo "$2" ;;
  mobile) axi emulate --viewport "375x812x2,mobile,touch" >/dev/null && echo "viewport 375x812 mobile" ;;
  desktop) axi emulate --viewport "1280x900x1" >/dev/null && echo "viewport 1280x900" ;;
  stop) axi stop ;;
  *) sed -n '2,15p' "$0"; exit 2 ;;
esac
