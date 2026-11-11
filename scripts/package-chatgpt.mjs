#!/usr/bin/env node
// Builds the ZIP that OpenAI's plugin dashboard takes: only the portable package files.
// Usage: node scripts/package-chatgpt.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";

const root = new URL("..", import.meta.url).pathname;
const out = "dist/willitplug-chatgpt.zip";
execFileSync(process.execPath, ["scripts/check.mjs"], { cwd: root, stdio: "inherit" });
const plugin = JSON.parse(readFileSync(`${root}plugin.json`, "utf8"));
assert.equal(plugin.apps, undefined);
assert.equal(plugin.extensions["com.openai"].apps, undefined);
mkdirSync(`${root}dist`, { recursive: true });
rmSync(`${root}${out}`, { force: true });
const files = [
  "plugin.json",
  "mcp.json",
  "LICENSE",
  "assets/logo.png",
  "skills/travel-power/SKILL.md",
];
execFileSync("zip", ["-q", "-X", out, ...files], {
  cwd: root,
  stdio: "inherit",
});

const inventory = execFileSync("unzip", ["-Z1", out], { cwd: root, encoding: "utf8" })
  .trim()
  .split("\n");
assert.deepEqual(inventory.sort(), [...files].sort());
const saved = JSON.parse(
  execFileSync("unzip", ["-p", out, "plugin.json"], { cwd: root, encoding: "utf8" }),
);
assert.deepEqual(saved, plugin);
assert(Array.isArray(saved.extensions["com.openai"].publication.countries));

const { review } = plugin.extensions["com.openai"];
console.log(`Built ${out}`);
if (!review.demo_recording_url) {
  console.log(
    "Add review.demo_recording_url to plugin.json and rebuild before you submit for review.",
  );
}
