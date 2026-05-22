import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.mjs"]
});
const client = new Client({
  name: "temporal-awareness-smoke-test",
  version: "0.1.0"
});

await client.connect(transport);

const tools = await client.listTools();
if (!tools.tools.some((tool) => tool.name === "get_current_time")) {
  throw new Error("get_current_time tool was not exposed");
}

const result = await client.callTool({
  name: "get_current_time",
  arguments: { timezone: "Asia/Karachi" }
});

if (!result.structuredContent?.local_iso) {
  throw new Error("get_current_time did not return structured time content");
}

console.log(JSON.stringify(result.structuredContent, null, 2));
await client.close();
