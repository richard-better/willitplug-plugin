# ChatGPT review preparation

The plugin is a draft for public submission. Richard confirmed availability in all
countries where ChatGPT supports apps; `publication.countries: []` makes this explicit.

The five positive review cases cover a trip, a country, an outlet-to-countries search,
connector details and a same-country boundary. `scripts/check.mjs --live` exercises
their backend calls, plus partial compatibility, device-label warnings and invalid input.
Three negative cases cover purchases, device control and electrical installation.

The live backend checks are separate from host review. Conversational tool selection,
negative-case behavior and the interactive trip view in ChatGPT are **Not run**.
Developer/domain verification, portal scans and creator attestations are outstanding.
No submission or publication is claimed by building the ZIP.

## Real host demo

Use an existing development connection to `https://www.willitplug.com/mcp/` with
Streamable HTTP and no authentication. Rehearse the actual five positive prompts in
`plugin.json`, then the electrical-installation negative prompt. Show the real tool
results, safety caveats, packing checklist and returned links; show the trip view when
the host supports it. Keep unrelated chats and account details off screen.

Record this working flow in the intended host, play back the saved video, and host it
at a reviewer-accessible destination chosen by the creator. Verify playback without a
private sign-in before setting `review.demo_recording_url` and rebuilding the ZIP.
A walkthrough script or backend test log is not a demo recording. An authorized
developer completes legal/policy attestations in the portal after preparation.
