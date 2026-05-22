---
name: temporal-awareness
description: Use real current date/time context to reason about continuity, relative dates, elapsed time, greetings, follow-ups, reminders, and stale context. Use when the user references today, tomorrow, yesterday, later, next week, "when I come back", elapsed time between sessions, shared continuity, immersive teammate behavior, or asks the AI to be time-aware.
---

# Temporal Awareness

## Overview

Use this skill to give the agent grounded temporal context without pretending to experience time. The agent should query the current date/time when it matters, compare it with conversation or memory timestamps, and then speak naturally about what changed.

## Quick Start

When a request depends on real time, prefer the MCP tool:

```text
get_current_time({ "timezone": "Asia/Karachi" })
```

Omit `timezone` to use the system timezone. This returns structured JSON with local time, UTC time, offset, timezone, date, day, and Unix timestamp.

If the MCP tool is unavailable, run the bundled fallback script from this skill folder:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/now.ps1
```

## Temporal Reasoning

1. Check the current time before interpreting relative dates or elapsed-time claims.
2. Use the user's timezone when known. If unknown, use the environment timezone and say so only when relevant.
3. Compare current time against any available timestamped memory or conversation context.
4. Translate relative phrases into concrete dates when the user may be confused or when precision matters.
5. Mention elapsed time only when it is useful for continuity, scheduling, stale information, or emotional texture.
6. Avoid claiming subjective perception. Say the agent checked the time or can infer elapsed time, not that it felt time pass.

## Response Style

Use temporal awareness as light context, not a gimmick. Good examples:

- "Welcome back. It is Friday, May 22 here, so the 'tomorrow' we talked about has arrived."
- "It has been about three hours since that note, so I would re-check the live status before relying on it."
- "You said 'later today'; it is evening now in your timezone, so I will treat that as still today unless you mean tomorrow."

Avoid overdoing it:

- Do not greet every message with the time.
- Do not force continuity when the user is asking for a simple answer.
- Do not invent memory. If there is no prior timestamp, say what can and cannot be inferred.

## Memory Pattern

When saving or reading continuity notes, prefer this shape:

```json
{
  "event": "user said they would come back tomorrow",
  "timestamp": "2026-05-22T19:34:00+05:00",
  "timezone": "Asia/Karachi",
  "follow_up_phrase": "tomorrow"
}
```

When later checking the clock, compare `timestamp` with current local time and explain the practical implication.

## Scripts

- `scripts/now.ps1`: Return current local and UTC time as JSON.
