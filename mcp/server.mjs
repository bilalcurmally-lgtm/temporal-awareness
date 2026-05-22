#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

function getOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return Math.round((asUtc - date.getTime()) / 60000);
}

function formatOffset(minutes) {
  const sign = minutes >= 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const mins = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

function currentTimePayload(timeZone) {
  const now = new Date();
  const resolvedTimeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: resolvedTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const offsetMinutes = getOffsetMinutes(now, resolvedTimeZone);

  return {
    local_iso: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${formatOffset(offsetMinutes)}`,
    utc_iso: now.toISOString(),
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    day: parts.weekday,
    timezone: resolvedTimeZone,
    utc_offset: formatOffset(offsetMinutes),
    unix_seconds: Math.floor(now.getTime() / 1000)
  };
}

const server = new McpServer({
  name: "temporal-awareness",
  version: "0.1.0"
});

server.registerTool(
  "get_current_time",
  {
    title: "Get Current Time",
    description: "Return the current date and time for the requested IANA timezone, or the system timezone when omitted.",
    inputSchema: {
      timezone: z.string().optional().describe("IANA timezone such as Asia/Karachi or America/New_York.")
    }
  },
  async ({ timezone }) => {
    try {
      const payload = currentTimePayload(timezone);
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: `Could not get current time: ${error.message}` }]
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
