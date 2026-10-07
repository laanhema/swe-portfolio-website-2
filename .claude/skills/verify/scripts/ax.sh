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
#   ax.sh tables                      print each .brutal-prose table's width vs its container; exit 1 if any overflows
#   ax.sh nav                         print the nav logo and menu button boxes and font; exit 1 unless the font is Noto Sans Variable
#   ax.sh buttons                     hover VIEW WORK, the first card's CODE and READ STORY, and SEND MESSAGE; exit 1 unless all four lift the same (#56)
#   ax.sh cursor                      print SEND MESSAGE's and the form fields' computed cursor; exit 1 unless the button is pointer and the fields are text (#86)
#   ax.sh mobile | desktop            viewport 375x812 mobile+touch | 1280x900
#   ax.sh stop                        stop this session's browser bridge
set -euo pipefail
export CHROME_DEVTOOLS_AXI_SESSION="${CHROME_DEVTOOLS_AXI_SESSION:-verify}"
# Headless Chrome reports (hover: none) / (pointer: none), which disables every @media (hover: hover) rule.
# Launch it with a mouse so `desktop` behaves like a desktop; `mobile` (touch emulation) still reports hover: none.
# Only applies when the session's browser starts: run `ax.sh stop` once to pick it up.
# Override by exporting CHROME_DEVTOOLS_AXI_CHROME_ARGS yourself; set it empty for the old pointer-less browser.
export CHROME_DEVTOOLS_AXI_CHROME_ARGS="${CHROME_DEVTOOLS_AXI_CHROME_ARGS---blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4}"
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
  tables)
    out="$(axi eval "[...document.querySelectorAll('.brutal-prose table')].map((t, i) => 'table ' + i + ': width=' + Math.round(t.getBoundingClientRect().width) + ' container=' + t.parentElement.clientWidth + (t.getBoundingClientRect().width > t.parentElement.clientWidth + 0.5 ? ' OVERFLOW' : ' fits')).join('\\n')" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
    echo "${out:-no tables}"
    ! grep -q OVERFLOW <<<"$out" ;;
  nav)
    out="$(axi eval "(() => { const box = e => { const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(v => +v.toFixed(2)).join(','); }; const logo = document.querySelector('nav a[aria-label^=laanhema]'); const menu = document.querySelector('nav button[aria-controls=mobile-menu]'); const font = getComputedStyle(logo).fontFamily.split(',')[0].replace(/[^A-Za-z -]/g, '').trim(); return 'logo=' + box(logo) + ' menu=' + box(menu) + ' font=' + font + (font === 'Noto Sans Variable' && getComputedStyle(menu).fontFamily === getComputedStyle(logo).fontFamily ? ' ok' : ' WRONG-FONT'); })()" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
    echo "$out"
    ! grep -q WRONG-FONT <<<"$out" ;;
  buttons)
    # Hover each button with a real CDP mouse move, then read the hovered control's computed lift.
    # The first hover scrolls the target into view and GSAP slides its section up 50px for 0.8s,
    # so wait, re-snapshot (refs are generation-tagged), hover again, and wait out the 100ms transition.
    rows=""
    for pat in 'link "VIEW WORK"' 'link "CODE"' 'link "READ STORY"' 'button "SEND MESSAGE"'; do
      for wait in 1.2 0.4; do
        line="$(axi snapshot --full | grep -E -m1 -- "$pat" || true)"
        [[ -n "$line" ]] || { echo "no snapshot line matches: $pat" >&2; exit 1; }
        axi hover "@$(grep -o 'uid=[^ ]*' <<<"$line" | head -1 | cut -d= -f2)" >/dev/null
        sleep "$wait"
      done
      rows+="$(axi eval "(() => { const el = [...document.querySelectorAll('a,button')].filter(x => x.matches(':hover')).pop(); if (!el) return 'NONE|' + matchMedia('(hover: hover)').matches + '|||'; const cs = getComputedStyle(el); return [el.textContent.trim().toUpperCase(), matchMedia('(hover: hover)').matches, cs.transform, cs.translate, cs.boxShadow].join('|'); })()" \
        | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"$'\n'
    done
    out="$(python3 -c '
import re, sys
want = ["VIEW WORK", "CODE", "READ STORY", "SEND MESSAGE"]
rows = [r.split("|") for r in sys.stdin.read().splitlines() if r]
ref = rows[0]
for i, (label, hov, tf, tr, sh) in enumerate(rows):
    status = "ok"
    if hov != "true": status = "NO-HOVER"
    elif label != want[i]: status = "WRONG-TARGET"
    elif i == 0 and tf != "matrix(1, 0, 0, 1, -3, -3)": status = "NOT-LIFTED"
    elif (tf, tr, sh) != (ref[2], ref[3], ref[4]): status = "MISMATCH"
    last = re.split(r", (?=rgba?\()", sh)[-1]
    print(f"{want[i]} transform={tf} translate={tr} shadow={last} {status}" + ("" if label == want[i] else f" (hovered: {label})"))
' <<<"$rows")"
    echo "$out"
    ! grep -q -E 'NO-HOVER|WRONG-TARGET|NOT-LIFTED|MISMATCH' <<<"$out" ;;
  cursor)
    # Computed cursor comes from the cascade, not :hover, so this only reads; no hover or GSAP waits needed.
    # MISSING fails the check closed when the contact section is not on the page.
    out="$(axi eval "(() => { const btn = [...document.querySelectorAll('#contact button')].find(b => b.textContent.trim().toUpperCase() === 'SEND MESSAGE'); if (!btn) return 'SEND MESSAGE cursor=? MISSING'; const rows = []; const c = getComputedStyle(btn).cursor; rows.push('SEND MESSAGE cursor=' + c + (c === 'pointer' ? ' ok' : ' NOT-POINTER')); for (const id of ['name', 'email', 'message']) { const el = document.getElementById(id); const v = el ? getComputedStyle(el).cursor : '?'; rows.push(id.toUpperCase() + ' cursor=' + v + (!el ? ' MISSING' : v === 'text' ? ' ok' : ' NOT-TEXT')); } return rows.join('\\n'); })()" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
    echo "$out"
    ! grep -q -E 'NOT-POINTER|NOT-TEXT|MISSING' <<<"$out" ;;
  aria) axi snapshot --full >"$2" && echo "$2" ;;
  mobile) axi emulate --viewport "375x812x2,mobile,touch" >/dev/null && echo "viewport 375x812 mobile" ;;
  desktop) axi emulate --viewport "1280x900x1" >/dev/null && echo "viewport 1280x900" ;;
  stop) axi stop ;;
  *) sed -n '2,17p' "$0"; exit 2 ;;
esac
