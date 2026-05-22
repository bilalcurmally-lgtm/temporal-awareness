# Temporal Awareness Cookbook

This cookbook shows practical patterns for using a clock tool with an AI agent. The point is not to make the agent pretend it experiences time. The point is to let it ground relative language, memory, and stale context in real timestamps.

## Pattern 1: "I'll Be Back Tomorrow"

User:

> I'll be back tomorrow and we can finish the deploy checklist.

Memory to store:

```json
{
  "event": "finish the deploy checklist",
  "timestamp": "2026-05-22T15:41:02+05:00",
  "timezone": "Asia/Karachi",
  "follow_up_phrase": "tomorrow"
}
```

Later, call:

```text
get_current_time({ "timezone": "Asia/Karachi" })
```

Agent behavior:

> Welcome back. It is Saturday, May 23 in your timezone, so the "tomorrow" we talked about has arrived. Last time, we were going to finish the deploy checklist.

Use this for:

- Returning to work after a break
- "Tomorrow", "next week", "after lunch", and "later today"
- Making project continuity feel natural without inventing memory

## Pattern 2: Stale Context Check

User:

> Is the staging deploy still green?

Existing memory:

```json
{
  "event": "staging deploy was green",
  "timestamp": "2026-05-22T10:15:00+05:00",
  "source": "deployment dashboard"
}
```

Agent behavior:

> I checked that earlier, but it has been about five hours. I should refresh the deployment status before treating it as still true.

Use this for:

- CI/build status
- Deployments
- Prices and exchange rates
- API availability
- Documentation that may have changed
- Sports, weather, schedules, and news

## Pattern 3: Timestamped Memory Hygiene

A memory without time:

```json
{
  "event": "user wants to revisit pricing"
}
```

A better memory:

```json
{
  "event": "user wants to revisit pricing",
  "timestamp": "2026-05-22T15:41:02+05:00",
  "timezone": "Asia/Karachi",
  "follow_up_phrase": "next week",
  "reason": "needs a clearer free vs paid split"
}
```

Agent behavior:

> We saved this last Friday with "next week" as the follow-up phrase. It is now Monday, so revisiting pricing is timely.

Use this for:

- Project notes
- Personal preferences that may decay
- Follow-up intentions
- Decisions that should be revisited
- Anything where "when did we say this?" matters

## Pattern 4: Timezone-Sensitive Collaboration

User:

> Can we do this today before the New York team wakes up?

Call:

```text
get_current_time({ "timezone": "Asia/Karachi" })
get_current_time({ "timezone": "America/New_York" })
```

Agent behavior:

> It is Friday afternoon for you and early morning in New York. You likely have a window before their workday starts.

Use this for:

- Distributed teams
- Deployment windows
- Customer support handoffs
- Planning around another region's business hours

## Pattern 5: Natural Session Warmth

User:

> ok back

Memory:

```json
{
  "event": "debugging MCP install docs",
  "timestamp": "2026-05-20T22:08:00+05:00"
}
```

Agent behavior:

> Welcome back. It has been about two days since we touched this; we were debugging the MCP install docs.

Use this sparingly. It should feel like continuity, not a clock announcement. Skip it when the user asks a simple direct question.

## Pattern 6: Relative Deadlines

User:

> Let's ship this by Friday.

Agent behavior:

1. Check current date.
2. Resolve "Friday" to a concrete date.
3. Confirm if there is ambiguity.

Example:

> Today is Wednesday, May 20 in your timezone, so I will treat "by Friday" as Friday, May 22 unless you mean the following week.

Use this for:

- Planning
- Task breakdowns
- Reminders
- Commitments with relative dates

## Anti-Patterns

Avoid:

- Saying the agent "felt" time pass.
- Greeting every message with the current time.
- Inventing a prior timestamp when none exists.
- Treating old memories as fresh without checking age.
- Making continuity theatrical when the user wants a quick answer.

Good temporal awareness is quiet. It appears when time changes the answer.
