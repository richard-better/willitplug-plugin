# Maintaining the WillItPlug plugin

This is the canonical source for the public agent package: marketplace manifests,
the travel-power skill, validation and ChatGPT packaging. The hosted tools and
electrical data belong to the private WillItPlug application repository.

- Keep the four plugin manifests aligned. `server.json` records the hosted MCP
  server's independently versioned registry identity, not the plugin version.
- Extend `skills/travel-power/SKILL.md` when the public tool contract changes.
  Preserve device-origin inputs, partial fit, grounding and device-label cautions.
- Keep all supported clients and the existing `travel-power` skill identity.
- Run `node scripts/check.mjs --live` and `node scripts/package-chatgpt.mjs` before
  a release. Backend checks do not establish conversational host behavior or a demo.
- Publish integration instructions and public connection metadata. Supply credentials
  through the host's secure configuration, never files in this repository.
- The website imports an explicit snapshot from this repository using its private
  `scripts/sync-agent-plugin.mjs`. Update that snapshot after a plugin release.
