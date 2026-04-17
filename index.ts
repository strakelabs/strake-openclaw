import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";
import { env } from "node:process";

// Normalize a Strake endpoint URL to end in /v1.
// Accepts: https://abc123.strake.sh  OR  https://abc123.strake.sh/v1
function resolveBaseUrl(raw: string): string {
  const stripped = raw.replace(/\/+$/, "").replace(/\/v1$/, "");
  return `${stripped}/v1`;
}

export default definePluginEntry({
  id: "strake",
  name: "Strake",
  description:
    "Route OpenClaw inference through a Strake encrypted proxy endpoint.",

  register(api) {
    api.registerProvider({
      id: "strake",
      label: "Strake",
      docsPath: "https://strake.sh",
      envVars: ["STRAKE_TOKEN"],

      auth: [
        createProviderApiKeyAuthMethod({
          providerId: "strake",
          methodId: "api-key",
          label: "Strake bearer token",
          hint: "Bearer token for your Strake endpoint — create one at app.strake.sh",
          optionKey: "strakeToken",
          flagName: "--strake-token",
          envVar: "STRAKE_TOKEN",
          promptMessage: "Enter your Strake bearer token",
          defaultModel: "strake/gpt-4o",
        }),
      ],

      catalog: {
        order: "simple",
        run: async (ctx) => {
          const { apiKey } = ctx.resolveProviderApiKey("strake");
          if (!apiKey) return null;

          const rawUrl = env.STRAKE_BASE_URL;
          if (!rawUrl) return null;

          return {
            provider: {
              baseUrl: resolveBaseUrl(rawUrl),
              apiKey,
              api: "openai-completions",
              // No static model list — resolveDynamicModel handles any model ID
              // the underlying Strake endpoint supports.
              models: [],
            },
          };
        },
      },

      // Strake is a proxy: accept whatever model ID the user passes and forward
      // it to the upstream provider unchanged.
      resolveDynamicModel: (ctx) => {
        const rawUrl = env.STRAKE_BASE_URL ?? "";
        return {
          id: ctx.modelId,
          name: ctx.modelId,
          provider: "strake",
          api: "openai-completions",
          baseUrl: resolveBaseUrl(rawUrl),
          reasoning: false,
          input: ["text"],
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          contextWindow: 128000,
          maxTokens: 8192,
        };
      },
    });
  },
});
