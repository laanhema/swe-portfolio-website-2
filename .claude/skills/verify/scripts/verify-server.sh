#!/usr/bin/env bash
# Start, check, and stop an isolated laanhema.dev server for verification runs.
#
#   verify-server.sh start [dev|preview]   start on $VERIFY_PORT (default 5199), print RUN_DIR
#   verify-server.sh doctor                read-only health check of the instance this script started
#   verify-server.sh stop                  kill only the process recorded in the pid file
#
# State: .temp/verify/server.{pid,port,mode,log}   (gitignored)
# Evidence: .temp/verify/runs/<run-id>/            (never deleted by stop)
set -euo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
STATE="$ROOT/.temp/verify"
PORT="${VERIFY_PORT:-5199}"
mkdir -p "$STATE/runs"

pid_alive() { [[ -f "$STATE/server.pid" ]] && kill -0 "$(cat "$STATE/server.pid")" 2>/dev/null; }

cmd_start() {
  local mode="${1:-dev}"
  if pid_alive; then
    echo "already running: pid $(cat "$STATE/server.pid") on port $(cat "$STATE/server.port") ($(cat "$STATE/server.mode"))" >&2
    exit 1
  fi
  if ss -ltn "sport = :$PORT" | grep -q LISTEN; then
    echo "port $PORT is owned by another process; set VERIFY_PORT to a free port" >&2
    exit 1
  fi
  [[ -d "$ROOT/node_modules" ]] || (cd "$ROOT" && npm ci)
  local vite_args=()
  if [[ "$mode" == preview ]]; then
    (cd "$ROOT" && npm run build >"$STATE/build.log" 2>&1) || { echo "build failed, see $STATE/build.log" >&2; exit 1; }
    vite_args=(preview)
  fi
  # setsid gives the server its own process group so stop can kill vite and its children together.
  cd "$ROOT"
  setsid node_modules/.bin/vite "${vite_args[@]}" --host 127.0.0.1 --port "$PORT" --strictPort \
      >"$STATE/server.log" 2>&1 </dev/null &
  echo $! >"$STATE/server.pid"
  echo "$PORT" >"$STATE/server.port"
  echo "$mode" >"$STATE/server.mode"
  for _ in $(seq 1 60); do
    if curl -sf "http://127.0.0.1:$PORT/" | grep -q '<title>laanhema.dev</title>'; then
      local run_id; run_id="$(date +%Y%m%d-%H%M%S)"
      mkdir -p "$STATE/runs/$run_id"
      echo "ready: http://127.0.0.1:$PORT ($mode, pid $(cat "$STATE/server.pid"))"
      echo "RUN_DIR=$STATE/runs/$run_id"
      return 0
    fi
    pid_alive || { echo "server exited, see $STATE/server.log" >&2; tail -20 "$STATE/server.log" >&2; exit 1; }
    sleep 0.5
  done
  echo "server did not answer within 30s, see $STATE/server.log" >&2
  exit 1
}

cmd_doctor() {
  local ok=1
  if pid_alive; then echo "process: ok (pid $(cat "$STATE/server.pid"), mode $(cat "$STATE/server.mode"))"
  else echo "process: DOWN (no live pid in $STATE/server.pid)"; ok=0; fi
  local port; port="$(cat "$STATE/server.port" 2>/dev/null || echo "$PORT")"
  local owner; owner="$(ss -ltnpH "sport = :$port" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2 || true)"
  if [[ -n "$owner" && -f "$STATE/server.pid" ]] && \
     [[ "$(ps -o pgid= -p "$owner" | tr -d ' ')" == "$(cat "$STATE/server.pid")" ]]; then
    echo "port: ok ($port owned by our process group)"
  else echo "port: NOT OURS ($port listener pid=${owner:-none})"; ok=0; fi
  for path in / /blog /blog/tralla; do
    if curl -sf "http://127.0.0.1:$port$path" | grep -q '<title>laanhema.dev</title>'; then echo "route $path: ok"
    else echo "route $path: FAIL"; ok=0; fi
  done
  echo "git: $(git -C "$ROOT" rev-parse --short HEAD)$(git -C "$ROOT" diff --quiet HEAD -- src index.html public || echo ' +uncommitted src changes')"
  [[ $ok == 1 ]] && echo "doctor: HEALTHY" || { echo "doctor: UNHEALTHY"; exit 1; }
}

cmd_stop() {
  if pid_alive; then
    local pid; pid="$(cat "$STATE/server.pid")"
    kill -- "-$pid" 2>/dev/null || kill "$pid"
    for _ in $(seq 1 20); do kill -0 "$pid" 2>/dev/null || break; sleep 0.25; done
    echo "stopped pid $pid"
  else
    echo "no running instance recorded"
  fi
  rm -f "$STATE/server.pid" "$STATE/server.port" "$STATE/server.mode"
}

case "${1:-}" in
  start) shift; cmd_start "$@" ;;
  doctor) cmd_doctor ;;
  stop) cmd_stop ;;
  *) sed -n '2,9p' "$0"; exit 2 ;;
esac
