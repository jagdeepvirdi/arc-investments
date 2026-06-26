#!/usr/bin/env bash
# ArcInvestments server management script
# Usage: ./ArcInvestments.sh <dev|prod> <start|stop|restart|status>

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$SCRIPT_DIR/.server"
LOG_DIR="$SCRIPT_DIR/.server/logs"

DEV_PORT=5179
PROD_PORT=4179
DEV_PID_FILE="$PID_DIR/dev.pid"
PROD_PID_FILE="$PID_DIR/prod.pid"
DEV_LOG="$LOG_DIR/dev.log"
PROD_LOG="$LOG_DIR/prod.log"

# ── helpers ──────────────────────────────────────────────────────────────────

usage() {
  echo "Usage: $0 <dev|prod> <start|stop|restart|status>"
  echo ""
  echo "  Environments:"
  echo "    dev   Vite dev server  (port $DEV_PORT)"
  echo "    prod  Vite preview     (port $PROD_PORT, requires prior build)"
  echo ""
  echo "  Actions:"
  echo "    start    Start the server"
  echo "    stop     Stop the server"
  echo "    restart  Stop then start"
  echo "    status   Show running state"
  exit 1
}

is_running() {
  local pid_file="$1"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid=$(cat "$pid_file")
    if kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

do_start() {
  local env="$1"
  local pid_file cmd port log

  if [[ "$env" == "dev" ]]; then
    pid_file="$DEV_PID_FILE"; cmd="npm run dev"; port=$DEV_PORT; log="$DEV_LOG"
  else
    pid_file="$PROD_PID_FILE"; cmd="npm run preview"; port=$PROD_PORT; log="$PROD_LOG"
  fi

  if is_running "$pid_file"; then
    echo "[ArcInvestments] $env server is already running (PID $(cat "$pid_file"), port $port)"
    return
  fi

  if [[ "$env" == "prod" ]] && [[ ! -d "$SCRIPT_DIR/dist" ]]; then
    echo "[ArcInvestments] No dist/ folder found — building first..."
    (cd "$SCRIPT_DIR" && npm run build)
  fi

  mkdir -p "$PID_DIR" "$LOG_DIR"

  echo "[ArcInvestments] Starting $env server on port $port..."
  (cd "$SCRIPT_DIR" && $cmd >> "$log" 2>&1) &
  local pid=$!
  echo "$pid" > "$pid_file"

  # Give the process a moment and confirm it stayed alive
  sleep 1
  if is_running "$pid_file"; then
    echo "[ArcInvestments] $env server started (PID $pid)"
    echo "                 URL : http://localhost:$port"
    echo "                 Log : $log"
  else
    echo "[ArcInvestments] ERROR: $env server failed to start. Check $log for details."
    rm -f "$pid_file"
    exit 1
  fi
}

do_stop() {
  local env="$1"
  local pid_file port

  if [[ "$env" == "dev" ]]; then
    pid_file="$DEV_PID_FILE"; port=$DEV_PORT
  else
    pid_file="$PROD_PID_FILE"; port=$PROD_PORT
  fi

  if ! is_running "$pid_file"; then
    echo "[ArcInvestments] $env server is not running."
    return
  fi

  local pid
  pid=$(cat "$pid_file")
  echo "[ArcInvestments] Stopping $env server (PID $pid)..."
  kill "$pid" 2>/dev/null || true

  # Wait up to 5 s for clean exit
  local i=0
  while kill -0 "$pid" 2>/dev/null && (( i < 10 )); do
    sleep 0.5
    (( i++ ))
  done

  if kill -0 "$pid" 2>/dev/null; then
    echo "[ArcInvestments] Process did not exit cleanly — sending SIGKILL..."
    kill -9 "$pid" 2>/dev/null || true
  fi

  rm -f "$pid_file"
  echo "[ArcInvestments] $env server stopped."
}

do_status() {
  local env="$1"
  local pid_file port log

  if [[ "$env" == "dev" ]]; then
    pid_file="$DEV_PID_FILE"; port=$DEV_PORT; log="$DEV_LOG"
  else
    pid_file="$PROD_PID_FILE"; port=$PROD_PORT; log="$PROD_LOG"
  fi

  if is_running "$pid_file"; then
    local pid
    pid=$(cat "$pid_file")
    echo "[ArcInvestments] $env server is RUNNING"
    echo "  PID  : $pid"
    echo "  Port : $port"
    echo "  URL  : http://localhost:$port"
    echo "  Log  : $log"
  else
    echo "[ArcInvestments] $env server is STOPPED"
    [[ -f "$log" ]] && echo "  Last log: $log"
  fi
}

# ── entry point ───────────────────────────────────────────────────────────────

ENV="${1:-}"
ACTION="${2:-}"

[[ -z "$ENV" || -z "$ACTION" ]] && usage
[[ "$ENV" != "dev" && "$ENV" != "prod" ]] && { echo "Error: environment must be 'dev' or 'prod'"; usage; }
[[ "$ACTION" != "start" && "$ACTION" != "stop" && "$ACTION" != "restart" && "$ACTION" != "status" ]] && { echo "Error: action must be start|stop|restart|status"; usage; }

case "$ACTION" in
  start)   do_start "$ENV" ;;
  stop)    do_stop  "$ENV" ;;
  restart) do_stop  "$ENV"; do_start "$ENV" ;;
  status)  do_status "$ENV" ;;
esac
