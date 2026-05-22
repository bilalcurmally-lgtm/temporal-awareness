# Use Cases

## Continuity

The user says, "I'll be back tomorrow." The agent records the timestamp. When the user returns, the agent checks the clock and can infer whether "tomorrow" has arrived.

## Stale Context

The agent fetched a price, build status, deployment state, or API result earlier. Before relying on it later, it checks elapsed time and decides whether to refresh the data.

## Natural Follow-Ups

The user says, "Remind me later today to test this." The agent can translate "later today" into the user's local date and preserve the intended time window.

## Session Warmth

The agent can lightly acknowledge time when it matters:

"Welcome back. It has been about two days since we touched this; last time we were wiring the smoke test."

This should be used sparingly. The goal is continuity, not performative clock-watching.

## Timezone-Sensitive Collaboration

When users, services, or collaborators are in different timezones, the tool can make relative language concrete:

"Your time is Friday evening, but the deployment window in New York is Friday morning."

## Memory Hygiene

Temporal metadata makes memory more useful. A memory entry like "user wants to revisit deployment tomorrow" is much better when stored with:

```json
{
  "event": "user wants to revisit deployment tomorrow",
  "timestamp": "2026-05-22T15:41:02+05:00",
  "timezone": "Asia/Karachi",
  "follow_up_phrase": "tomorrow"
}
```

The clock gives the agent enough context to interpret that memory later.
