# Temporal Awareness

Temporal Awareness is a tiny MCP server for grounding AI agents in real date/time context. It also includes an optional Codex skill that teaches the response behavior: when to check the clock, how to compare it with memory, and how to talk about continuity without pretending to experience time.

It is for people building AI teammates, coding agents, companions, assistants, and workflow tools where "today", "tomorrow", "later", "when I come back", or "that thing we checked earlier" should mean something concrete.

The idea is simple:

- A model does not continuously feel time pass.
- A clock tool can give it real temporal facts.
- A lightweight skill can teach it when to check the clock and how to connect that with memory, reminders, stale context, and "I'll be back tomorrow" moments.

## What It Includes

- `mcp/server.mjs`: MCP server exposing `get_current_time`.
- `SKILL.md`: Optional Codex skill for temporal reasoning and response style.
- `scripts/now.ps1`: PowerShell fallback for Windows users.
- `scripts/now.sh`: shell fallback for macOS/Linux users.
- `scripts/now.mjs`: cross-platform fallback implementation used by `now.sh`.
- `docs/mcp-clients.md`: setup examples for Codex, Claude Desktop, Cursor, Windsurf, and generic MCP clients.
- `examples/use-cases.md`: Practical scenarios where time awareness improves the experience.
- `examples/cookbook.md`: Copyable patterns for continuity, stale context, timezone handling, and timestamped memory.

## Use Cases

Temporal Awareness is useful when an agent needs to:

- Recognize that "tomorrow" from a previous session has arrived.
- Decide whether earlier context is stale and should be refreshed.
- Store memories with timestamps so they can be interpreted later.
- Resolve relative deadlines like "Friday", "later today", or "next week".
- Coordinate across timezones.
- Add light conversational continuity without pretending to be conscious.

See [`examples/cookbook.md`](examples/cookbook.md) for concrete patterns.

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

Add the MCP server to your AI client's MCP config. For Codex:

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

For Claude Desktop, Cursor, Windsurf, and generic MCP clients, see [`docs/mcp-clients.md`](docs/mcp-clients.md).

## Smoke Test

From `temporal-awareness/mcp`:

```bash
npm test
```

The test starts the MCP server, calls `get_current_time` for `Asia/Karachi`, and prints the structured result.

Fallback scripts are also available:

```bash
./scripts/now.sh
```

```powershell
powershell -ExecutionPolicy Bypass -File scripts/now.ps1
```

## Why This Matters

Temporal awareness is not consciousness. It is grounding.

For an AI teammate, time lets the system say useful things like:

- "You said you would come back tomorrow; it is tomorrow now."
- "That status was checked four hours ago, so I should refresh it."
- "It is evening in your timezone, so 'later today' probably means the remaining few hours."

That small shift can make an AI feel less like a stateless answer box and more like a collaborator with continuity.

## Design Principle

Use time when it changes the answer.

Do not make the agent announce the clock constantly. Do not make it claim it felt time pass. Let the tool provide facts, let memory provide context, and let the agent reason from both.
