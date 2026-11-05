#!/usr/bin/env node
// Builds the ZIP that OpenAI's plugin dashboard takes: only the portable package files.
// Usage: node scripts/package-chatgpt.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const out = "dist/willitplug-chatgpt.zip";
mkdirSync(`${root}dist`, { recursive: true });
rmSync(`${root}${out}`, { force: true });
execFileSync("zip", ["-q", "-X", "-r", out, "plugin.json", "mcp.json", "assets/logo.png", "skills"], {
  cwd: root,
  stdio: "inherit",
});

const { review } = JSON.parse(readFileSync(`${root}plugin.json`, "utf8")).extensions["com.openai"];
console.log(`Built ${out}`);
if (!review.demo_recording_url) {
  console.log("Add review.demo_recording_url to plugin.json and rebuild before you submit for review.");
}
