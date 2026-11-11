# Source boundaries

This repository owns public client manifests, `travel-power`, review metadata and ZIP
packaging. Hosted tools and electrical data belong to the private application repo.

- Plugin releases: keep the four client manifest versions aligned. `server.json`
  tracks the hosted MCP version independently. Follow `docs/publishing.md` for releases.
- Lookup changes: preserve device-origin inputs, per-plug fit, grounding and label checks
  in `skills/travel-power/SKILL.md`. Verify all tool contracts with the live check.
- Package changes: run `node scripts/check.mjs --live` and `node scripts/package-chatgpt.mjs`.
  Completion requires passing checks and inspection of the resulting ZIP. Backend checks
  establish neither conversational host behavior nor a recorded demo.
- Website updates: import the committed release through the application's
  `scripts/sync-agent-plugin.mjs`; retain its existing domain skill alias.
- Distribution: package public instructions and connection metadata. Keep credentials
  in the host's secure configuration.
