#!/usr/bin/env node
// Checks that every manifest describes the same plugin and fits the marketplace limits.
// Usage: node scripts/check.mjs [--live] [--base https://www.willitplug.com]
//   --live  also tests the MCP server and listing URLs. --base sends those requests to another
//           host, such as a local dev server, instead of the URLs in the manifests.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const args = process.argv.slice(2);
const live = args.includes("--live");
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : undefined;

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
  console.log(`${ok ? "ok  " : "FAIL"} ${message}`);
};

const plugin = read("plugin.json");
const openai = plugin.extensions["com.openai"];
const listing = openai.interface;
const review = openai.review;
const manifests = {
  "plugin.json": plugin,
  ".claude-plugin/plugin.json": read(".claude-plugin/plugin.json"),
  ".cursor-plugin/plugin.json": read(".cursor-plugin/plugin.json"),
  "gemini-extension.json": read("gemini-extension.json"),
  "server.json": read("server.json"),
};
const serverUrl = read("mcp.json").mcpServers.willitplug.url;
const urls = {
  ".mcp.json": read(".mcp.json").mcpServers.willitplug.url,
  "gemini-extension.json": read("gemini-extension.json").mcpServers.willitplug.httpUrl,
  "server.json": read("server.json").remotes[0].url,
};

for (const [path, manifest] of Object.entries(manifests)) {
  check(manifest.version === plugin.version, `${path} is version ${plugin.version}`);
}
for (const [path, url] of Object.entries(urls)) check(url === serverUrl, `${path} uses ${serverUrl}`);
for (const path of [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
  check(manifests[path].name === plugin.name, `${path} is named ${plugin.name}`);
  check(manifests[path].description === plugin.description, `${path} matches the description`);
}

check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(plugin.name), "name is lowercase kebab-case");
check(manifests["server.json"].description.length <= 100, "server.json description is 100 chars or less");
check(listing.displayName.length <= 30, "displayName is 30 chars or less");
check(listing.shortDescription.length <= 30, "shortDescription is 30 chars or less");
check(listing.longDescription.length <= 4000, "longDescription is 4,000 chars or less");
check(listing.developerName.length <= 80, "developerName is 80 chars or less");
check(listing.defaultPrompt.length <= 3, "at most 3 default prompts");
check(listing.defaultPrompt.every((p) => p.length <= 128), "default prompts are 128 chars or less");
check(review.test_cases.positive.length === 5, "exactly 5 positive review cases");
check(review.test_cases.negative.length === 3, "exactly 3 negative review cases");
check(
  review.test_cases.positive.every((c) => c.tools_triggered && c.expected_behavior),
  "positive cases name their tools and expected behavior",
);
const listingUrls = {
  websiteURL: listing.websiteURL,
  supportURL: listing.supportURL,
  privacyPolicyURL: listing.privacyPolicyURL,
  termsOfServiceURL: listing.termsOfServiceURL,
};
for (const [field, url] of Object.entries(listingUrls)) {
  check(url?.startsWith("https://"), `${field} is an HTTPS URL`);
}
for (const path of [listing.logo, listing.composerIcon, manifests[".cursor-plugin/plugin.json"].logo]) {
  check(existsSync(join(root, path)), `${path} exists`);
}
check(existsSync(join(root, "skills/travel-power/SKILL.md")), "the skill exists");
check(existsSync(join(root, "LICENSE")), "LICENSE exists");
const readmeWords = readFileSync(join(root, "README.md"), "utf8")
  .replace(/```[\s\S]*?```/g, "")
  .split(/\s+/).length;
check(readmeWords >= 40, "README has at least 40 words outside code blocks");

const runLive = async () => {
  const at = (url) => (base ? new URL(new URL(url).pathname, base).href : url);
  const endpoint = at(serverUrl);
  const rpc = async (method, params) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "Mcp-Protocol-Version": "2025-06-18",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: AbortSignal.timeout(20_000),
    });
    return (await response.json()).result;
  };
  const call = (name, args) => rpc("tools/call", { name, arguments: args });
  const text = (result) => result.content.map((part) => part.text).join("\n");

  const info = await rpc("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "willitplug-plugin-check", version: plugin.version },
  });
  check(info.serverInfo.name === "willitplug", "server answers initialize");

  const { tools } = await rpc("tools/list");
  check(
    tools.map((tool) => tool.name).sort().join() === "check_trip,country_plugs",
    "server lists check_trip and country_plugs",
  );
  for (const tool of tools) {
    const { readOnlyHint, destructiveHint, openWorldHint, title } = tool.annotations ?? {};
    check(
      title && readOnlyHint === true && destructiveHint === false && openWorldHint === false,
      `${tool.name} has a title and explicit annotations`,
    );
  }

  // The tool calls behind the review cases in plugin.json.
  const usUk = await call("check_trip", { from: "us", to: "gb" });
  check(usUk.structuredContent.adapterNeeded === true, "US to UK needs an adapter");
  check(text(usUk).includes("/from/united-states/to/united-kingdom/"), "US to UK links its trip page");
  const itCh = await call("check_trip", { from: "it", to: "ch" });
  check(itCh.structuredContent.fit === "some", "Italy to Switzerland is a partial fit");
  const usJp = await call("check_trip", { from: "us", to: "jp" });
  check(usJp.structuredContent.notes.length === 2, "US to Japan keeps its two regional notes");
  check(usJp.structuredContent.converterNeeded === "maybe", "US to Japan leaves voltage to the label");
  const japan = await call("country_plugs", { country: "jp" });
  check(text(japan).includes("100V") && text(japan).includes("/plugs/japan/"), "Japan lookup answers");
  const unknown = await call("country_plugs", { country: "Narnia" });
  check(unknown.isError === true, "unknown country is an error the model can read");
  const leaked = [usUk, itCh, usJp, japan].some((result) => JSON.stringify(result).includes("amazon."));
  check(!leaked, "tool results contain no retailer links");

  const get = await fetch(endpoint, {
    headers: { Accept: "text/event-stream" },
    signal: AbortSignal.timeout(10_000),
  }).catch(() => undefined);
  check(get?.status === 405, "GET on the MCP endpoint answers 405 instead of hanging");
  await get?.body?.cancel();

  for (const [field, url] of Object.entries(listingUrls)) {
    const response = await fetch(at(url), { signal: AbortSignal.timeout(20_000) }).catch(() => undefined);
    check(response?.status === 200, `${field} answers 200`);
    await response?.body?.cancel();
  }
};

if (live) {
  await runLive().catch((error) => check(false, `live check stopped: ${error.message}`));
}

console.log(failures.length ? `\n${failures.length} failed` : "\nAll checks passed");
process.exit(failures.length ? 1 : 0);
