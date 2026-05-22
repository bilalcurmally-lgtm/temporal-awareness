# MCP Client Setup

Temporal Awareness runs locally on the user's machine. Each client starts `mcp/server.mjs` as a stdio MCP server, so the tool reads that machine's clock unless a specific IANA timezone is passed.

## Codex

Add this to your Codex config:

```toml
[mcp_servers.temporal_awareness]
command = "node"
args = [ "/absolute/path/to/temporal-awareness/mcp/server.mjs" ]

[mcp_servers.temporal_awareness.tools.get_current_time]
approval_mode = "approve"
```

On Windows, use a Windows path:

```toml
[mcp_servers.temporal_awareness]
command = "node"
args = [ 'C:\Users\you\temporal-awareness\mcp\server.mjs' ]
```

Restart Codex after changing config.

## Claude Desktop

Add this to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "temporal_awareness": {
      "command": "node",
      "args": ["/absolute/path/to/temporal-awareness/mcp/server.mjs"]
    }
  }
}
```

Restart Claude Desktop after changing config.

## Cursor, Windsurf, And Generic MCP Clients

Use the same stdio server shape:

```json
{
  "mcpServers": {
    "temporal_awareness": {
      "command": "node",
      "args": ["/absolute/path/to/temporal-awareness/mcp/server.mjs"]
    }
  }
}
```

Some clients use a project-level MCP file and others use a global settings file. The important parts are:

- `command` is `node`
- `args` points to `mcp/server.mjs`
- the path is absolute
- dependencies have been installed with `npm install` inside `temporal-awareness/mcp`

## Tool Call

The exposed tool is:

```text
get_current_time({ "timezone": "Asia/Karachi" })
```

`timezone` is optional. If omitted, the server uses the system timezone.

## Local-Only Behavior

This server does not call a remote API. It runs locally, reads local time via JavaScript `Date` and `Intl`, and returns structured JSON to the MCP client.
