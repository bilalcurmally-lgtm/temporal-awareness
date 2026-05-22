# Temporal Awareness

Temporal Awareness is a tiny MCP server and Codex skill that lets an AI agent check the current date/time and reason about continuity without pretending to experience time.

The idea is simple:

- A model does not continuously feel time pass.
- A clock tool can give it real temporal facts.
- A lightweight skill can teach it when to check the clock and how to connect that with memory, reminders, stale context, and "I'll be back tomorrow" moments.

## What It Includes

- `mcp/server.mjs`: MCP server exposing `get_current_time`.
- `SKILL.md`: Codex skill for temporal reasoning and response style.
- `scripts/now.ps1`: PowerShell fallback for Windows users.
- `examples/use-cases.md`: Practical scenarios where time awareness improves the experience.

## Tool Output

`get_current_time` returns structured JSON:

```json
{
  "local_iso": "2026-05-22T15:41:02+05:00",
  "utc_iso": "2026-05-22T10:41:02.000Z",
  "date": "2026-05-22",
  "time": "15:41:02",
  "day": "Friday",
  "timezone": "Asia/Karachi",
  "utc_offset": "+05:00",
  "unix_seconds": 1779446462
}
```

## Install

Clone the repo and install the MCP server dependencies:

```bash
git clone https://github.com/bilalcurmally-lgtm/temporal-awareness.git
cd temporal-awareness/mcp
npm install
```

Add the MCP server to your Codex config:

```toml
[mcp_servers.temporal_awareness]
command = "node"
args = [ "/absolute/path/to/temporal-awareness/mcp/server.mjs" ]

[mcp_servers.temporal_awareness.tools.get_current_time]
approval_mode = "approve"
```

Optionally install the Codex skill by copying this repo folder into your Codex skills directory:

```bash
cp -R temporal-awareness ~/.codex/skills/temporal-awareness
```

On Windows PowerShell:

```powershell
Copy-Item -Recurse temporal-awareness $env:USERPROFILE\.codex\skills\temporal-awareness
```

Restart Codex after changing MCP config.

## Smoke Test

From `temporal-awareness/mcp`:

```bash
npm test
```

The test starts the MCP server, calls `get_current_time` for `Asia/Karachi`, and prints the structured result.

## Why This Matters

Temporal awareness is not consciousness. It is grounding.

For an AI teammate, time lets the system say useful things like:

- "You said you would come back tomorrow; it is tomorrow now."
- "That status was checked four hours ago, so I should refresh it."
- "It is evening in your timezone, so 'later today' probably means the remaining few hours."

That small shift can make an AI feel less like a stateless answer box and more like a collaborator with continuity.
