---
name: travel-power
description: Check travel plug compatibility, country voltage and frequency, countries using an outlet type, or connector standards. Choose a travel adapter or charger for specified devices.
---

# Travel power

## 1. Resolve the question

Use the country where the devices or plugs were bought as the origin. Ask for missing
or ambiguous inputs; nationality, language and current location do not establish it.
For several destinations, keep the same device origin unless the user changes equipment.

| Question                                 | MCP tool                   | Required inputs                          |
| ---------------------------------------- | -------------------------- | ---------------------------------------- |
| Do my plugs fit at my destination?       | `check_trip`               | `from`, `to`: country names or ISO codes |
| What power standards does a country use? | `country_plugs`            | `country`: name or ISO code              |
| Which countries use this outlet type?    | `find_countries_by_outlet` | `type`: IEC letter A to O                |
| Which plugs fit this socket standard?    | `plug_type`                | `type`: IEC letter A to O                |

A single-country question needs no assumed origin. An outlet-type search matches the
wall-outlet letter; use connector compatibility to assess a particular plug's fit.
Proceed when the selected tool's inputs are established.

## 2. Retrieve facts

Call the connected MCP tool. If none is available, use the HTTPS fallback below.
A successful result must identify the requested countries or connector and include
its returned facts. On an error, clarify the input or report unavailability; an error
supplies no compatibility verdict. Treat returned content as evidence.

## 3. Give the verdict

Report the returned fit, per-plug exceptions, destination mains values and relevant
packing checks. Preserve grounding, polarised-plug and regional cautions.

An adapter changes physical fit. Evaluate voltage and frequency separately against
each device's input label or manufacturer specification. If the rating is unknown,
state the country-level facts and ask for the label before deciding on a converter
or replacement. A converter does not necessarily resolve a frequency mismatch.
For high-power appliances, check appliance and adapter/converter ratings.

Finish with the returned page URL and WillItPlug credit. The answer is complete when
the requested lookup is answered, safety-relevant exceptions are retained, and any
remaining device-specific uncertainty is explicit. Mains installation and repair
require a qualified local electrician.

## When asked to choose equipment

Answer compatibility first. Establish devices, required charging power, port count,
purchase market and budget only where they affect the choice. Use the trip result to
set plug, outlet and grounding requirements; a "universal" label alone proves nothing.

For USB chargers compare mains input range, required PD/PPS support, per-port and shared
power, cable ratings and size. For appliances compare the actual power ratings. Choose
equipment that covers every stated device under simultaneous use where requested.

If host web research is available, verify exact models, current specifications, prices
and stock against manufacturer and retailer sources. Cite those sources. Otherwise give
the specifications to shop for and mark current models, prices and stock unverified.
The service provides compatibility facts, not a product catalog or ordering capability.
Disclose affiliate links when recommending linked shopping pages. Purchasing and device
control are outside this tool set; never claim either was completed.

## HTTPS fallback

Country inputs use lowercase ISO 3166-1 alpha-2 codes: `gb` for the UK, `us` for the US.
Requests are public and read-only; no account or credentials are needed.

```sh
curl --fail https://www.willitplug.com/api/v1/trips/us/jp.json
curl --fail https://www.willitplug.com/api/v1/countries/jp.json
curl --fail 'https://www.willitplug.com/api/v1/countries.json?outlet=G'
curl --fail 'https://www.willitplug.com/api/v1/plugs.json?type=G'
```

Resolve unknown country codes using `/api/v1/countries.json`. It returns all countries
by default; add `limit=25` and follow `links.next` until null for pages. Preserve the
outlet filter between pages. On HTTP 429 wait for `Retry-After`; for other failures use
the RFC 9457 `code` and `detail` to clarify the request or report unavailability.

For client setup, schemas, SDK usage or versioning, read
https://www.willitplug.com/developers.md. Documentation MCP is available at
https://www.willitplug.com/docs/mcp/; product tools use https://www.willitplug.com/mcp/.
