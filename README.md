# @strakelabs/openclaw-strake

**OpenClaw shouldn't need your real API keys. Now it doesn't.**

This plugin registers [Strake](https://strake.sh) as a model provider in OpenClaw. Your actual OpenAI, Anthropic, or other API keys stay encrypted in the Strake vault. OpenClaw gets a disposable proxy URL and a bearer token — independently revocable, never stored in plaintext on your machine.

---

## How it works

```
OpenClaw → Strake endpoint → your real API key → upstream provider
                ↑
        disposable bearer token
        (revoke it anytime without
         touching the real key)
```

Strake sits in the middle. If the token leaks, rotate it in seconds. The real key never moves.

---

## Install

```bash
openclaw plugins install @strakelabs/openclaw-strake
```

---

## Setup

**1. Create a Strake endpoint** at [app.strake.sh](https://app.strake.sh) — pick your provider, paste your API key, grab the endpoint URL and bearer token.

**2. Set the environment variables:**

```bash
export STRAKE_BASE_URL=https://abc123.strake.sh
export STRAKE_TOKEN=your-bearer-token
```

Add these to your shell profile or CI secrets. The token is what you generated in the Strake dashboard — not your real API key.

**3. Onboard:**

```bash
openclaw onboard --strake-token $STRAKE_TOKEN
```

**4. Run:**

```bash
openclaw --model strake/gpt-4o
openclaw --model strake/claude-3-5-sonnet-20241022
openclaw --model strake/gemini-2.0-flash
```

Any model ID your upstream provider accepts works — Strake proxies it through unchanged.

---

## Why bother?

| Without Strake | With Strake |
|---|---|
| Real key in `~/.openclaw/config` | Disposable token only |
| Key leak = full account exposure | Token leak = revoke in seconds |
| One key, all your tools share it | Per-tool tokens, isolated blast radius |
| Rotate key = update every tool | Rotate key = zero config changes |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `STRAKE_BASE_URL` | Yes | Your Strake endpoint URL (e.g. `https://abc123.strake.sh`) |
| `STRAKE_TOKEN` | Yes | Bearer token from your Strake endpoint |

Both are set by the Strake CLI automatically if you use `strake run`:

```bash
strake run my-proxy -- openclaw
```

No manual env setup needed — the token is minted, injected, and revoked when OpenClaw exits.

---

## Using with the Strake CLI

If you have the [Strake CLI](https://www.npmjs.com/package/@strakelabs/strake) installed, the cleanest workflow is:

```bash
# One-time setup
strake auth login
strake endpoint create openai

# Every session
strake run my-proxy -- openclaw
```

`strake run` mints an ephemeral token, sets `STRAKE_BASE_URL` and `STRAKE_TOKEN`, launches OpenClaw, and revokes the token on exit. Nothing lingers.

---

## Links

- [Strake dashboard](https://app.strake.sh)
- [Strake docs](https://strake.sh)
- [Strake CLI on npm](https://www.npmjs.com/package/@strakelabs/strake)
- [Issues / feedback](https://github.com/strakelabs/community/issues)

---

MIT © [Dalton Solutions, LLC](https://strake.sh)
