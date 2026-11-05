# Measuring discovery

Being listed gets WillItPlug found by name. Growth comes from an assistant choosing it without being
asked, and no marketplace publishes rankings, so measure it directly.

Once a week, run these in a fresh chat with WillItPlug available but not named, on each assistant it is
listed in. Record whether it was called, and what was used instead. Add a line to the log below.

## Target prompts

Direct:

1. Do I need a plug adapter for the UK if I'm from the US?
2. Will my European charger work in Japan?
3. What sockets do they use in Thailand?
4. What's the voltage in Brazil?
5. I'm from Germany and going to South Africa. What adapter do I need?
6. Can I use my UK hair dryer in the United States?
7. Is an adapter enough for Australia, or do I need a converter?
8. Do Italian plugs fit in Switzerland?

Packing and buying:

9. What electronics should I pack for two weeks in Japan? I live in Canada.
10. Which travel adapter should I buy for a trip from France to the UK?
11. Help me pick a USB-C charger for a US to India trip with a phone and a 65 W laptop.
12. I'm visiting Spain, Morocco and the UK from the US. What do I need to charge my things?

Looking for a tool:

13. Find me a plugin that checks travel plug compatibility.
14. Is there a connector for checking travel adapters and voltage?
15. What tool can tell me whether my plugs work abroad?

## Changing what gets picked

Hosts choose from the server instructions, tool names, tool descriptions and parameter schemas. These
live in the site's `src/lib/mcp.ts`. Say what a tool does, when to use it, what it takes and what it
returns, in the words travellers use.

Do not name competitors, tell the model to prefer WillItPlug, or claim a broader scope than plugs and
power. OpenAI and Google both prohibit that. Change one thing at a time, so the weekly numbers can show
what helped.

## Keeping it healthy

`.github/workflows/check.yml` runs the live check on every push and each Monday. Directory reviewers and
hosts see latency and errors, so treat a failure there as a production bug.

## Log

| Date | Assistant | Prompts where called (of 15) | Called instead | Change since last run |
| ---- | --------- | ---------------------------- | -------------- | --------------------- |
