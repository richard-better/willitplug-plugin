# Publishing WillItPlug

Requirements were read from each marketplace's docs on 2026-11-05. They change often, so re-read the
linked page before you submit.

## Before any marketplace

1. Deploy the site, so `/privacy/`, `/terms/` and `/support/` are live and `GET /mcp/` answers 405.
2. Check that `willitplug-support@richardb.me` receives mail.
3. Confirm the operator name in `src/lib/publisher.ts` and here in the manifests matches the identity
   you verify. Have the privacy policy and terms reviewed.
4. Make this repository public. Cursor requires open source, Gemini's crawler needs a public repo, and
   a Claude listing can't go live from a private one.
5. Run `node scripts/check.mjs --live` until every check passes.

## Status

| Marketplace           | Route                                  | Blocked on                                  |
| --------------------- | -------------------------------------- | ------------------------------------------- |
| Official MCP Registry | Published: `com.willitplug/willitplug` | Current endpoint version is 1.2.1           |
| Gemini CLI gallery    | Repo topic, crawled daily              | Public repo                                 |
| Claude connector      | Developer portal                       | Paid Claude plan, live test                 |
| Claude plugin         | Developer portal, same session         | Public repo, connector submitted            |
| ChatGPT plugin        | Plugins dashboard, ZIP                 | Verified identity, demo video, live test    |
| Cursor marketplace    | cursor.com/marketplace/publish         | Public repo, local test                     |
| GitHub Copilot        | Own marketplace repo or direct install | Decide if worth it; no central review found |
| Google Connected Apps | Preview application                    | Eligibility is doubtful, see below          |

## Official MCP Registry

The product endpoint is published as
[`com.willitplug/willitplug`](https://registry.modelcontextprotocol.io/v0.1/servers/com.willitplug%2Fwillitplug/versions/latest).
`server.json` mirrors its metadata. Its server version is independent of the plugin release.

The site now serves `/.well-known/mcp-registry-auth` directly on both the apex and www host,
so HTTP domain verification works without a redirect. The existing Ed25519 private key stays
outside both repositories; its location and release procedure are documented in the private
application repository. Use that existing proof and key for future releases. Do not generate
a second identity just to release this plugin. Registry versions are immutable; publish a new
server version only after the hosted server changes and its deployment is verified.

Docs: [remote servers](https://modelcontextprotocol.io/registry/remote-servers),
[authentication](https://modelcontextprotocol.io/registry/authentication).

## Claude

Submit both from [the developer portal](https://claude.ai/directory/manage). Anthropic asks for the
connector as well as a plugin that points at it, so the listing owns the server's details.

1. Add the server as a custom connector and call its four tools from a conversation.
2. **Submit new > MCP connector**. There is no test account to give: say the server is public with no
   authentication. Under data handling, the API is your own. Answer the sponsored content question
   truthfully: tool results have none, and linked pages may have affiliate links.
3. **Submit new > Plugin bundle**, with this repository and its root as the plugin path.

New connectors are listed as Community. Anthropic may escalate useful ones to Verified automatically,
and there is no application.

Docs: [connector](https://claude.com/docs/connectors/building/submission),
[plugin](https://claude.com/docs/plugins/submit),
[checklist](https://claude.com/docs/plugins/pre-submission-checklist),
[verification](https://claude.com/docs/connectors/verification).

## ChatGPT

1. Verify your identity. The directory shows that name, so `developerName` has to match it.
2. Test the server in ChatGPT's developer mode.
3. Record a walkthrough of the five positive review cases and put a reviewer-accessible link in
   `review.demo_recording_url` in `plugin.json`.
4. Run `node scripts/package-chatgpt.mjs` and upload `dist/willitplug-chatgpt.zip` to the
   [Plugins dashboard](https://platform.openai.com/plugins).
5. Connect the server. If asked for domain verification, serve the token as plain text at
   `/.well-known/openai-apps-challenge` on the site, then deploy.
6. Run the tool scan, then submit. After approval, publishing is a separate action.

The package explicitly targets all countries where ChatGPT supports apps, as confirmed by
Richard. See [review status](review-status.md) for the outstanding host demo and checks.

`mcp.json` puts `extensions` on the server entry as OpenAI's docs show, although the Agent Plugins 1.0
schema does not allow that property there. If a strict host rejects it, fix it for that host without
removing the auth block OpenAI reads.

Docs: [submission](https://developers.openai.com/plugins/deploy/submission),
[package](https://developers.openai.com/plugins/build/plugins),
[guidelines](https://developers.openai.com/plugins/plugin-guidelines).

## Cursor

Copy the repository to `~/.cursor/plugins/local/willitplug`, reload Cursor, and check that the skill and
server appear. Then submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).
Every plugin and update is reviewed by hand. Docs: [plugins](https://cursor.com/docs/plugins).

## Gemini CLI

Add the `gemini-cli-extension` topic to the public repository. The gallery crawls tagged repositories
daily. Docs: [releasing](https://geminicli.com/docs/extensions/releasing/).

## GitHub Copilot

The root `plugin.json` and `mcp.json` use the portable format Copilot reads, so
`copilot plugin install richard-better/willitplug-plugin` should work once public. Docs:
[plugins](https://docs.github.com/en/copilot/reference/plugin-and-marketplace-reference).

## Google Connected Apps

This is a preview that opens in phases, and you [apply in the console](https://connected.google.com/console/help/?apply).
WillItPlug may not qualify. Its [policy](https://developers.google.com/connected-apps/connected-apps-policy)
requires tangible functionality and bans advertising content. A third-party summary says Google also
excludes generic signed-out information, which would describe WillItPlug; that wording isn't in the
policy page. Apply, and expect a possible no.

## Affiliate links

Keep them out of everything the plugin returns. OpenAI says plugins [must not serve advertisements](https://developers.openai.com/plugins/plugin-guidelines),
Anthropic's [directory policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy)
excludes sponsored content and paid placements, and Google requires no advertising. None of them mentions
affiliate links directly. So the tools return no retailer links, `check.mjs --live` enforces that, and
the listing discloses that linked pages may have affiliate links. If a reviewer objects, change the
listing, not the checks.

## Releasing an update

Raise `version` in the four plugin manifests; `check.mjs` checks they agree. Keep `server.json`
aligned with the independently versioned hosted server. Then push and build a new ZIP. A plugin-only
release does not require publishing a new MCP Registry version. Claude and Cursor review each new
commit or version.
