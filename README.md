# WillItPlug for AI assistants

Ask your AI assistant whether your plugs will fit before you travel. This repository connects
assistants to [WillItPlug](https://www.willitplug.com/)'s hosted MCP server and adds a skill for
explaining plugs, voltage and frequency, and for working out which adapter or charger to buy.

There is no account, API key or sign-in, and nothing to install or run locally.

## What you can ask

- "I'm traveling from the United States to the UK. Do I need a plug adapter?"
- "What plugs, voltage and frequency are used in Japan?"
- "Help me choose an adapter and USB-C charger for a trip from Germany to Japan."

## Tools

| Tool                     | What it does                                                               |
| ------------------------ | -------------------------------------------------------------------------- |
| `check_trip(from, to)`   | Which plugs fit, whether an adapter or converter is needed, what to pack   |
| `country_plugs(country)` | One country's outlet and plug types, voltage, frequency and regional notes |

Both are read-only and take an English country name or ISO code.

## Connect it

Server URL, using Streamable HTTP with no authentication:

```
https://www.willitplug.com/mcp/
```

| Client         | How                                                              |
| -------------- | ---------------------------------------------------------------- |
| Claude Code    | `claude mcp add --transport http willitplug https://www.willitplug.com/mcp/` |
| Claude         | Customize > Connectors > add a custom connector with the URL     |
| ChatGPT        | Install WillItPlug from the plugin directory once it is listed   |
| Cursor         | Install from the marketplace once listed, or add the URL as an MCP server |
| Gemini CLI     | `gemini extensions install https://github.com/richard-better/willitplug-plugin` |
| GitHub Copilot | Add the URL as an HTTP MCP server, or install this repository as a plugin |

## What it sends and fetches

The plugin runs no local code. When a tool is called, the assistant sends the country names or codes
to `https://www.willitplug.com/mcp/` and gets back public data and links to WillItPlug pages. It sends
nothing else, and needs no credentials or personal data.

Those pages may contain shop links, and some may be affiliate links. The tools return no product
links, prices or checkout.

- [Privacy policy](https://www.willitplug.com/privacy/)
- [Terms](https://www.willitplug.com/terms/)
- [Support](https://www.willitplug.com/support/)

## Repository layout

The manifests all describe the same plugin, in the format each marketplace reads.

| Path                                  | Read by                                    |
| ------------------------------------- | ------------------------------------------ |
| `plugin.json`, `mcp.json`             | ChatGPT, GitHub Copilot, Agent Plugins hosts |
| `.claude-plugin/plugin.json`, `.mcp.json` | Claude                                 |
| `.cursor-plugin/plugin.json`          | Cursor                                     |
| `gemini-extension.json`               | Gemini CLI                                 |
| `server.json`                         | Official MCP Registry                      |
| `skills/`, `assets/`                  | All of the above, where supported          |

The server itself lives in the WillItPlug site and is not in this repository.

## Development

Needs Node 22 or newer and no dependencies.

```sh
node scripts/check.mjs                # manifests agree and are within marketplace limits
node scripts/check.mjs --live         # also test the production server and listing URLs
node scripts/package-chatgpt.mjs      # build dist/willitplug-chatgpt.zip for OpenAI's dashboard
```

[docs/publishing.md](docs/publishing.md) has the steps for each marketplace, and
[docs/discovery.md](docs/discovery.md) has how to measure whether assistants pick WillItPlug.

## License

[MIT](LICENSE) covers this repository: the manifests, skill and scripts. WillItPlug's data is free to
use with a link back, as described on the [developers page](https://www.willitplug.com/developers/).
